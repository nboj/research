'use server'
import { revalidatePath } from "next/cache"

export const update = async (path: string) => {
    console.log(`REVALIDATING ${path}`)
    revalidatePath(path, "page");
}
