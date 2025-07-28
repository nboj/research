import generator_icon from '@/public/generator_icon.png';

import { Comparison } from "../types";
import Link from "next/link";
import CreateComparison from "./_components/CreateComparison";
import DeleteComparison from "./_components/DeleteComparison";
import { pool } from "../_lib/db";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from '../_lib/s3';

export const dynamic = 'force-dynamic';

interface LayoutProps {
    children: React.ReactNode;
}
export default async function Layout({ children }: LayoutProps) {
    const res = await pool.query(`
SELECT DISTINCT ON (c.id)
    c.id,
    c.seed,
    row_to_json(ga) AS generation_a,
    row_to_json(gb) AS generation_b
FROM comparison AS c
LEFT JOIN generation AS ga ON ga.comparison_id = c.id
LEFT JOIN generation AS gb ON gb.comparison_id = c.id AND ga.id <> gb.id;
	`);
    const rows: Comparison[] = res.rows
    console.log(rows);
    for (let row of rows) {
        {
            if (row.generation_a) {
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

            if (row.generation_b) {
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
                {children}
                <div className="flex flex-col w-[20rem]">
                    <div className="flex w-full justify-between items-center">
                        <CreateComparison />
                        <DeleteComparison />
                    </div>
                    <div className="flex w-[20rem] flex-col relative">
                        {
                            rows.map((comparison, index) => {
                                return (
                                    <Link href={`/${comparison.id}`} className="w-[20rem] relative flex flex-col" key={`${comparison.id}-${index}`} >
                                        <div className={"flex w-[20rem]"}>
                                            <img src={comparison?.generation_a?.output ?? generator_icon.src} alt={"Generated image."} className='object-contain w-[50%]' />
                                            <img src={comparison?.generation_b?.output ?? generator_icon.src} alt={"Generated image."} className='object-contain w-[50%]' />
                                        </div>
										<p className='w-full text-sm'>{comparison.generation_a?.prompt ?? comparison.generation_b?.prompt }</p>
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
