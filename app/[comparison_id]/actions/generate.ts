'use server'

import { GenerateActionState, GenerateState, Generation } from "../../types";

export const generate = async (generation: Generation): Promise<GenerateActionState> => {
    console.log(generation);
    await new Promise((res) => {
        setTimeout(() => { res(true) }, 2000)
    })
    return {
        state: GenerateState.SUCCESS
    }
} 
