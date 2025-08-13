import Compare from "./_components/Compare";
import { Comparison } from "../types";
import { pool } from "../_lib/db";
import { validate } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../_lib/s3";

export const dynamic = "force-dynamic"

type ComparisonPageProps = Readonly<{
    params: Promise<{ comparison_id: string }>
}>
export default async function ComparisonPage({ params }: ComparisonPageProps) {
    const id = (await params).comparison_id;
    let valid = validate(id);
    if (!valid && id != "comparisons") {
        return (
            <p>{id} is invalid</p>
        );
    } else if (!valid) {
        return (
            <></>
        );
    }
    const res = await pool.query(`
		SELECT DISTINCT ON (c.id)
			c.id,
			c.seed,
			row_to_json(ga) AS generation_a,  
			row_to_json(gb) AS generation_b  
		FROM   comparison  AS c
		LEFT JOIN   generation  AS ga  ON ga.comparison_id = c.id  
		LEFT JOIN   generation  AS gb  ON gb.comparison_id = c.id AND ga.id <> gb.id
		WHERE c.id = '${id}'
	`);
    const rows: Comparison[] = res.rows;
    const output_a = rows[0].generation_a && await getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: process.env.BUCKET!,
            Key: rows[0].generation_a?.output,
        }),
        { expiresIn: 60 * 60 }
    );
    const output_a_lrp = rows[0].generation_a && await getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: process.env.BUCKET!,
            Key: rows[0].generation_a?.output_lrp,
        }),
        { expiresIn: 60 * 60 }
    );
    const image_outputs_a = [];
    if (rows[0].generation_a) {
        for (let image of rows[0].generation_a.images) {
            const img = rows[0].generation_a && await getSignedUrl(
                s3,
                new GetObjectCommand({
                    Bucket: process.env.BUCKET!,
                    Key: image,
                }),
                { expiresIn: 60 * 60 }
            );
            image_outputs_a.push(img);
        }
    }
    console.log("OUTPUTLRP", output_a_lrp)
    const output_b = rows[0].generation_b && await getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: process.env.BUCKET!,
            Key: rows[0].generation_b?.output,
        }),
        { expiresIn: 60 * 60 }
    );
    const output_b_lrp = rows[0].generation_b && await getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: process.env.BUCKET!,
            Key: rows[0].generation_b?.output_lrp,
        }),
        { expiresIn: 60 * 60 }
    );
    const image_outputs_b = [];
    if (rows[0].generation_b) {
        for (let image of rows[0].generation_b.images) {
            const img = rows[0].generation_b && await getSignedUrl(
                s3,
                new GetObjectCommand({
                    Bucket: process.env.BUCKET!,
                    Key: image,
                }),
                { expiresIn: 60 * 60 }
            );
            image_outputs_b.push(img);
        }
    }
    const comparison: Comparison = {
        ...rows[0],
        generation_a: rows[0].generation_a && {
            ...rows[0].generation_a as any,
            output: output_a,
            output_lrp: output_a_lrp,
            options: {
                ...rows[0].generation_a?.options ?? {}
            },
            images: image_outputs_a
        },
        generation_b: rows[0].generation_b && {
            ...rows[0].generation_b as any,
            output: output_b,
            output_lrp: output_b_lrp,
            options: {
                ...rows[0].generation_b?.options ?? {}
            },
            images: image_outputs_b
        }
    }
    console.log(comparison);
    // try {
    //     const data: any = await runWithAmplifyServerContext({
    //         nextServerContext: { cookies },
    //         operation: async (contextSpec) => {
    //             const url = await getUrl(contextSpec, {
    //                 path: "data/wallpaper.jpeg",
    //                 options: {
    //                     expiresIn: 1000,
    //                     validateObjectExistence: true
    //                 }
    //             });
    //             const session = await fetchAuthSession(contextSpec);
    //             console.log(session.tokens?.accessToken.toString())
    //             const res = await fetch(url.url, {
    //                 method: 'GET',
    //             });
    //             return res;
    //         }
    //     });
    //     console.log(data);
    // } catch (e) {
    //     console.log(e);
    // }

    if (rows.length > 0) {
        return (
            <Compare comparison={comparison} />
        )
    } else {
        return (
            <h1>Could not find comparison result for id: {id}</h1>
        );
    }

}
