'use server'

import { pool } from "@/app/_lib/db"
import { runWithAmplifyServerContext } from "@/app/_utils/amplifyServerUtils";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const createComparison = async () => {
    const seed = Math.floor(Math.random() * 10_000_000_000_000);
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let userid = await runWithAmplifyServerContext({
            nextServerContext: { cookies },
            operation: async (contextSpec) => {
                try {
                    const session = await fetchAuthSession(contextSpec);
                    return session.tokens?.idToken?.payload.sub;
                } catch (e: any) {
                    console.log("Err aquiring userid", e);
                    return;
                }
            }
        })
        let comparison = await client.query(`
            insert into comparison (seed, user_id)
            values ($1, $2)
            RETURNING id
        `, [seed, userid]);
        if (comparison.rows.length <= 0) {
            console.error("Could not find comparison id on created comparison");
            throw new Error("Could not find comparison id on created comparison")
        }
        let comparison_id = comparison.rows[0].id;
        await client.query('COMMIT');
        await client.query(`
            insert into generation (seed, user_id, comparison_id, index)
            values ($1, $2, $3, 0)
        `, [seed, userid, comparison_id]);
        let generation = await client.query(`
            insert into generation (seed, user_id, comparison_id, index)
            values ($1, $2, $3, 1)
            RETURNING id
        `, [seed, userid, comparison_id]);
        if (generation.rows.length <= 0) {
            console.error("Could not find generation id on created comparison");
            throw new Error("Could not find generation id on created comparison")
        }
        let generation_id = generation.rows[0].id;
        await client.query('COMMIT');
        revalidatePath("/[comparison_id]", "layout");
        return [comparison_id, generation_id];
    } catch (e: any) {
        await client.query('ROLLBACK');
        console.log("Err creating comparison:", e);
    } finally {
        client.release();
    }
    return []
};

export const deleteAllComparisons = async () => {
    let res = await pool.query(`delete from comparison CASCADE`);
    console.log(res);
    revalidatePath("/[comparison_id]", "layout");
}
