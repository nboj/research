'use client'

import { Button, Textarea } from "@heroui/react";
import Image from "next/image";
import { useActionState, useState } from "react";
import Form from 'next/form'
import { generate } from "./actions/generate";
import { GenerateActionState, GenerateState } from "./types";
import generator_icon from '@/public/generator_icon.png';
import Link from "next/link";

const DEFAULT_STATE: GenerateActionState = {
    state: GenerateState.PENDING
}

type PromptSelectionProps = Readonly<{
    seed: string;
}>
const PromptSection = ({ seed }: PromptSelectionProps) => {
    const [actionState, action, pending] = useActionState(generate, DEFAULT_STATE);
    if (actionState.state == GenerateState.ERROR) {
        return (
            <div>
                <h1 className="text-md">Uh Oh... Something went wrong, please reload the page.</h1>
            </div>
        )
    }
    return (
        <Form action={action} className="basis-1/2 flex flex-col gap-3" >
            <div className="w-full h-60 rounded-[10px] border-1 border-zinc-200">
                <Image src={generator_icon} alt={"Generated image."} className='object-contain h-full' />
            </div>
            <Textarea name="prompt" label="Prompt" isRequired={true} variant="bordered" color="primary" placeholder="Enter your prompt..." />
            <Button variant='bordered' color="primary" type='submit' isLoading={pending}>{pending ? "Generating..." : "Generate"}</Button>
        </Form>
    )
}

export default function Home() {
    const [seed, setSeed] = useState<string>("238974897213723");
    return (
        <div className="relative @container h-full flex flex-col justify-center gap-[1rem] max-w-[800px] m-auto">
            <h1 className="text-xl font-light">Compare</h1>
            <div className="flex w-full gap-[1rem] relative">
                <PromptSection seed={seed} />
                <span className="self-stretch bg-zinc-300 mb-10 w-[2px]"></span>
                <PromptSection seed={seed} />
            </div>
            <Link href='/api/auth/sign-out'>Sign Out</Link>
        </div>
    );
}
