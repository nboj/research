import Image from "next/image";
import generator_icon from '@/public/generator_icon.png';

import { Comparison } from "../types";
import Link from "next/link";
import CreateComparison from "./_components/CreateComparison";
import DeleteComparison from "./_components/DeleteComparison";
import { pool } from "../_lib/db";

export const dynamic = 'force-dynamic';

interface LayoutProps {
    children: React.ReactNode;
}
export default async function Layout({ children }: LayoutProps) {
    const res = await pool.query(`
		SELECT
			c.id,
			c.seed,
			row_to_json(ga) AS generation_a,  
			row_to_json(gb) AS generation_b  
		FROM   comparison  AS c
		LEFT JOIN   generation  AS ga  ON ga.comparison_id = c.id  
		LEFT JOIN   generation  AS gb  ON gb.comparison_id = c.id
	`);
    const rows: Comparison[] = res.rows
    return (
        <>

            <div className="flex w-full justify-center gap-[2rem] m-auto">
                {children}
                <div className="flex flex-col">
                    <CreateComparison />
                    {
                        rows.map((comparison, index) => {
                            return (
                                <Link href={`/${comparison.id}`} className="w-[10rem] flex" key={`${comparison.id}-${index}`} >
                                    <Image src={comparison?.generation_a?.output ?? generator_icon} alt={"Generated image."} className='object-contain h-full rounded-md' />
                                    <Image src={comparison?.generation_b?.output ?? generator_icon} alt={"Generated image."} className='object-contain h-full rounded-md' />
                                </Link>
                            )
                        })
                    }
                    <DeleteComparison />
                </div>
            </div>
            <a href="/api/auth/sign-out">Sign Out</a>
        </>
    )
}
