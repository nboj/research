import { cookies } from "next/headers";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import generator_icon from '@/public/generator_icon.png';
import { runWithAmplifyServerContext } from "../_utils/amplifyServerUtils";
import { fetchAuthSession } from "aws-amplify/auth/server";
import CreateComparison from "./[comparison_id]/_components/CreateComparison";
import DeleteComparison from "./[comparison_id]/_components/DeleteComparison";
import { Comparison } from "../types";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../_lib/s3";
import { pool } from "../_lib/db";
import styles from "./page.module.css"
import Link from "next/link";

export const dynamic = "force-dynamic"

export default async function ComparisonPage() {
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
                    <CreateComparison />
                    <DeleteComparison />
                </div>
            )
        }
        const res = await pool.query(`
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
              WHERE c.user_id = $1
            ) s;
        `, [user_id]);
        console.log(res)
        const rows: Comparison[] = res.rows[0].comparison;
        console.log(rows);
        for (let row of rows) {
            {
                if (row.generation_a?.output) {
                    const output = await getSignedUrl(
                        s3,
                        new GetObjectCommand({
                            Bucket: process.env.BUCKET!,
                            Key: row.generation_a?.output,
                        }),
                        { expiresIn: 60 }
                    );
                    const output_lrp = await getSignedUrl(
                        s3,
                        new GetObjectCommand({
                            Bucket: process.env.BUCKET!,
                            Key: row.generation_a?.output_lrp,
                        }),
                        { expiresIn: 60 }
                    );
                    row.generation_a.output = output;
                    row.generation_a.output_lrp = output_lrp;
                }

            }
            {

                if (row.generation_b?.output) {
                    const output = await getSignedUrl(
                        s3,
                        new GetObjectCommand({
                            Bucket: process.env.BUCKET!,
                            Key: row.generation_b?.output,
                        }),
                        { expiresIn: 60 }
                    );
                    const output_lrp = await getSignedUrl(
                        s3,
                        new GetObjectCommand({
                            Bucket: process.env.BUCKET!,
                            Key: row.generation_b?.output_lrp,
                        }),
                        { expiresIn: 60 }
                    );
                    row.generation_b.output = output;
                    row.generation_b.output_lrp = output_lrp;
                }
            }
        }
        return (
            <>
                <div className="flex w-full justify-center gap-[2rem] m-auto">
                    <div className="flex flex-col w-[20rem]">
                        <div className="flex w-full justify-between items-center">
                            <CreateComparison />
                            <DeleteComparison />
                        </div>
                        <div className="flex w-[20rem] flex-col relative">
                            {
                                rows.map((comparison, index) => {
                                    return (
                                        <Link href={`/comparison/${comparison.id}`} className="w-[20rem] relative flex flex-col" key={`${comparison.id}-${index}`} >
                                            <div className={styles.nav_item}>
                                                <img src={comparison?.generation_a?.output ?? generator_icon.src} alt={"Generated image."} className='object-contain w-[50%]' />
                                                <img src={comparison?.generation_b?.output ?? generator_icon.src} alt={"Generated image."} className='object-contain w-[50%]' />
                                            </div>
                                            <p className='w-full text-sm'>{comparison.generation_a?.prompt ?? comparison.generation_b?.prompt}</p>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <a href="/api/auth/sign-out">Sign Out</a>
            </>
        )
}
