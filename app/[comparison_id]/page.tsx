import Compare from "./_components/Compare";
import { Comparison } from "../types";
import { pool } from "../_lib/db";

export const dynamic = "force-dynamic"

type ComparisonPageProps = Readonly<{
    params: Promise<{ comparison_id: string }>
}>
export default async function ComparisonPage({ params }: ComparisonPageProps) {
    const id = (await params).comparison_id;
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
    console.log("ROWSSSS", res);
    if (rows.length > 0) {
        return (
            <Compare comparison={rows[0]} />
        )
    } else {
        return (
            <h1>Could not find comparison result for id: {id}</h1>
        );
    }

}
