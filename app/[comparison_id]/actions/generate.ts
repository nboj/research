'use server'

import { runWithAmplifyServerContext } from '@/app/_utils/amplifyServerUtils';
import { GenerateActionState, GenerateState, Generation } from "../../types";
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { cookies } from 'next/headers';



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

export const generate = async (generation: Generation): Promise<GenerateActionState> => {
    console.log(generation);
    try {
        const res: boolean = await runWithAmplifyServerContext({
            nextServerContext: { cookies },
            operation: async (contextSpec) => {
                try {
                    const session = await fetchAuthSession(contextSpec);
                    let result = await fetch("http://127.0.0.1:8000/create-prompt", {
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
                    let body = await result.json();
                    console.log(body);
                    return result.ok;
                } catch (error) {
                    console.error(typeof error, error);
                    return false;
                }
            }
        });
        if (res) {
            return {
                state: GenerateState.SUCCESS
            }
        } else {
            return {
                state: GenerateState.ERROR
            }
        }
    } catch (e) {
        console.log(typeof e, e);
    }
    await new Promise((res) => {
        setTimeout(() => { res(true) }, 2000)
    })
    return {
        state: GenerateState.SUCCESS
    }
} 
