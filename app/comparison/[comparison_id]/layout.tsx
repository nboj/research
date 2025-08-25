import { runWithAmplifyServerContext } from "@/app/_utils/amplifyServerUtils";
import CompareNavigation from "./_components/CompareNavigation";
import { cookies } from "next/headers";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { pool } from "@/app/_lib/db";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ comparison_id: string }>
}
export default async function Layout({children, params}: LayoutProps) {
    const {comparison_id} = await params;

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
                'generation_a', ga.id,
                'generation_b', gb.id
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
        `, [user_id, comparison_id]);

    } catch (e: any) {
        console.error("Err querying id: ", comparison_id, e);
        return <h1>Could not find comparison result for id: {comparison_id}</h1>
    }
    const comparisons: {id: string, generation_a: string, generation_b: string}[] = res.rows[0].comparison;
    return (
        <div className="w-full flex items-center h-full justify-center flex-col relative">
            <CompareNavigation comparison_id={comparison_id} generation_a={comparisons[0].generation_a} generation_b={comparisons[0].generation_b} />
            {children}
        </div>
    )
}
