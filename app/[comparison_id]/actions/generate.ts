'use server'

import { runWithAmplifyServerContext } from '@/app/_utils/amplifyServerUtils';
import { GenerateActionState, GenerateState, Generation } from "../../types";
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { cookies } from 'next/headers';
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from '@/app/_lib/s3';
import { pool } from '@/app/_lib/db';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';



//#[derive(Deserialize)]
//#[serde(crate = "rocket::serde")]
//struct Options {
//    medium: Vec<String>,
//}
//
//#[derive(Deserialize)]
//#[serde(crate = "rocket::serde")]
//struct Generation {
//    userid: String,
//    seed: String,
//    prompt: String,
//    options: Options,
//}
//// NOTE: needs
//// * userid
//// * prompt
//// * options
//// * seed
//#[post("/create-prompt", data = "<data>")]
//fn create_prompt(data: Json<Generation>) -> &'static str {
//    log::info!("{}", data.prompt);
//    "yolo"
//}

export const generate = async (generation: Generation, comparison_id: string): Promise<GenerateActionState> => {
    console.log(generation);
    try {
        const res: any = await runWithAmplifyServerContext({
            nextServerContext: { cookies },
            operation: async (contextSpec) => {
                try {
                    const session = await fetchAuthSession(contextSpec);
                    let result = await fetch("http://192.168.122.61:8000/create-prompt", {
                        method: "POST",
                        body: JSON.stringify({
                            userid: session.tokens?.idToken?.payload.sub,
                            prompt: generation.prompt,
                            options: { ...generation.options },
                            seed: generation.seed,
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    console.log(result);
                    let prompt = await result.json();
                    if (!result.ok) {
                        return result;
                    }
                    console.log(prompt);
                    console.log();
                    console.log();
                    console.log("GENERATING...");
                    console.log();
                    console.log();
                    let result2 = await fetch("http://192.168.122.61:8000/generate", {
                        method: "POST",
                        body: JSON.stringify({
                            userid: session.tokens?.idToken?.payload.sub,
                            prompt: prompt,
                            seed: generation.seed,
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    let data: { tokens: string[], images: string[] } = await result2.json();

                    let generation_id = crypto.randomUUID();


                    console.log(comparison_id)
                    {

                        const key = `data/${comparison_id}/${generation_id}/output.png`;
                        const body = Buffer.from(data.images[0], "base64");
                        await s3.send(new PutObjectCommand({
                            Bucket: process.env.BUCKET!,
                            Key: key,
                            Body: body,
                            ContentType: "image/png",
                        }));
                    }
                    {

                        const key = `data/${comparison_id}/${generation_id}/output_lrp.png`;
                        const body = Buffer.from(data.images[1], "base64");
                        await s3.send(new PutObjectCommand({
                            Bucket: process.env.BUCKET!,
                            Key: key,
                            Body: body,
                            ContentType: "image/png",
                        }));
                    }
                    let images = [];
                    {
                        for (let token = 0; token < data.tokens.length; token++) {
                            const key = `data/${comparison_id}/${generation_id}/${token}.png`;
                            images.push(key);
                            const body = Buffer.from(data.images[token+2], "base64");
                            await s3.send(new PutObjectCommand({
                                Bucket: process.env.BUCKET!,
                                Key: key,
                                Body: body,
                                ContentType: "image/png",
                            }));
                        }

                    }
                    console.log(images)
                    await pool.query(`
						INSERT INTO generation (id, output, output_lrp, seed, prompt, options, comparison_id, images, tokens)
						VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
					`, [
                        generation_id,
                        `data/${comparison_id}/${generation_id}/output.png`,
                        `data/${comparison_id}/${generation_id}/output_lrp.png`,
                        generation.seed,
                        prompt,
                        JSON.stringify(generation.options),
                        comparison_id,
                        images,
                        data.tokens
                    ]);
                    return {
                        status: result2.ok,
                        data: { images: data.images, tokens: data.tokens },
                        prompt: prompt,
                    };
                } catch (error) {
                    console.error(typeof error, error);
                    return error;
                }
            }
        });
        if (res && res.status) {
            return {
                state: GenerateState.SUCCESS,
                data: res.data,
                prompt: res.prompt,
            }
        } else {
            console.log(res)
            return {
                state: GenerateState.ERROR
            }
        }
    } catch (e) {
        console.log(typeof e, e);
        return {
            state: GenerateState.ERROR
        }
    }
} 
