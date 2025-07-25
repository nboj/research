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
		SELECT
			c.id,
			c.seed,
			row_to_json(ga) AS generation_a,  
			row_to_json(gb) AS generation_b  
		FROM   comparison  AS c
		LEFT JOIN   generation  AS ga  ON ga.comparison_id = c.id  
		LEFT JOIN   generation  AS gb  ON gb.comparison_id = c.id
		WHERE c.id = '${id}'
	`);
    const rows: Comparison[] = res.rows;
	const output_a = await getSignedUrl(
		s3,
		new GetObjectCommand({
			Bucket: process.env.BUCKET!,
			Key: `data/${rows[0].id}/${rows[0].generation_a?.id}/output_a.png`,
		}),
		{ expiresIn: 60 }
	);
	const output_a_lrp = await getSignedUrl(
		s3,
		new GetObjectCommand({
			Bucket: process.env.BUCKET!,
			Key: `data/${rows[0].id}/${rows[0].generation_a?.id}/output_a_lrp.png`,
		}),
		{ expiresIn: 60 }
	);
	const output_b = await getSignedUrl(
		s3,
		new GetObjectCommand({
			Bucket: process.env.BUCKET!,
			Key: `data/${rows[0].id}/${rows[0].generation_b?.id}/output_b.png`,
		}),
		{ expiresIn: 60 }
	);
	const output_b_lrp = await getSignedUrl(
		s3,
		new GetObjectCommand({
			Bucket: process.env.BUCKET!,
			Key: `data/${rows[0].id}/${rows[0].generation_b?.id}/output_b_lrp.png`,
		}),
		{ expiresIn: 60 }
	);
	const comparison: Comparison = {
		...rows[0],
		generation_a: rows[0].generation_a && {
			...rows[0].generation_a as any,
			output: output_a,
			output_lrp: output_a_lrp,
			options: {
				...rows[0].generation_a?.options ?? {}
			}
		},
		generation_b:  rows[0].generation_b &&{
			...rows[0].generation_b as any,
			output: output_b,
			output_lrp: output_b_lrp,
			options: {
				...rows[0].generation_a?.options ?? {}
			}
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
