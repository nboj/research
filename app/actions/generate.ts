'use server'

import { GenerateActionState, GenerateState } from "../types";

export const generate = async (prevState: GenerateActionState, data: FormData): Promise<GenerateActionState> => {
    const prompt = data.get("prompt");
    if (!prompt) return {
        state: GenerateState.ERROR
    }
    await new Promise((res) => {
        setTimeout(() => { res(true) }, 2000)
    })
    return {
        state: GenerateState.SUCCESS
    }
} 
