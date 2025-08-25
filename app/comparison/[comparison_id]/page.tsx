import Compare from "./_components/Compare";
import { Comparison } from "../../types";
import { pool } from "../../_lib/db";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../_lib/s3";
import { runWithAmplifyServerContext } from "@/app/_utils/amplifyServerUtils";
import { cookies } from "next/headers";
import { fetchAuthSession } from "aws-amplify/auth/server";

export const dynamic = "force-dynamic"

type ComparisonPageProps = Readonly<{
    params: Promise<{ comparison_id: string }>
}>
export default async function ComparisonPage({ params }: ComparisonPageProps) {
    const id = (await params).comparison_id;
    const user_id: any = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: async (contextSpec) => {
            try {
                const session = await fetchAuthSession(contextSpec);
                return session.tokens?.idToken?.payload.sub;
            } catch (e: any) {
                return null
            }
        }
    })
    if (!user_id) {
        return (
            <div className="flex w-full justify-between items-center">
                Error, no user id
            </div>
        )
    }
    let res;
    try {
        res = await pool.query(`
            SELECT COALESCE(json_agg(comp ORDER BY comp->>'id'), '[]'::json) AS comparison
            FROM (
              SELECT json_build_object(
                'id', c.id,
                'generation_a', row_to_json(ga),
                'generation_b', row_to_json(gb)
              ) AS comp
              FROM comparison c
              LEFT JOIN (
                SELECT g.*, row_number() OVER (PARTITION BY g.comparison_id ORDER BY g.id) AS rn
                FROM generation g
              ) ga ON ga.comparison_id = c.id AND ga.rn = 1
              LEFT JOIN (
                SELECT g.*, row_number() OVER (PARTITION BY g.comparison_id ORDER BY g.id) AS rn
                FROM generation g
              ) gb ON gb.comparison_id = c.id AND gb.rn = 2
              WHERE c.user_id = $1 AND c.id = $2
            ) s;
        `, [user_id, id]);

    } catch (e: any) {
        console.error("Err querying id: ", id, e);
        return <h1>Could not find comparison result for id: {id}</h1>
    }
    const rows: Comparison[] = res.rows[0].comparison;
    const output_a = rows[0].generation_a?.output && await getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: process.env.BUCKET!,
            Key: rows[0].generation_a?.output,
        }),
        { expiresIn: 60 * 60 }
    );
    const output_a_lrp = rows[0].generation_a?.output && await getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: process.env.BUCKET!,
            Key: rows[0].generation_a?.output_lrp,
        }),
        { expiresIn: 60 * 60 }
    );
    const image_outputs_a = [];
    if (rows[0].generation_a?.output) {
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
    const output_b = rows[0].generation_b?.output && await getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: process.env.BUCKET!,
            Key: rows[0].generation_b?.output,
        }),
        { expiresIn: 60 * 60 }
    );
    const output_b_lrp = rows[0].generation_b?.output && await getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: process.env.BUCKET!,
            Key: rows[0].generation_b?.output_lrp,
        }),
        { expiresIn: 60 * 60 }
    );
    const image_outputs_b = [];
    if (rows[0].generation_b?.output) {
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
    console.log(rows);

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
