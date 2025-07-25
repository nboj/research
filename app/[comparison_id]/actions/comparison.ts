'use server'

import { pool } from "@/app/_lib/db"
import { revalidatePath } from "next/cache";

export const createComparison = async () => {
    const seed = Math.floor(Math.random() * 10_000_000_000_000);
    let res = await pool.query(`
		insert into comparison (seed)
		values ('${seed}')
	`);
    console.log(res);
    revalidatePath("/[comparison_id]", "layout");
};

export const deleteAllComparisons = async () => {
    let res = await pool.query(`delete from comparison`);
    console.log(res);
    revalidatePath("/[comparison_id]", "layout");
}
