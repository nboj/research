'use client'

import { Button, Textarea } from "@heroui/react";
import Image from "next/image";
import { useCallback, useState } from "react";

type Prompt = {
    raw: string;
    img?: {
        src: string;
    }
}

type PromptSelectionProps = Readonly<{
    seed: string;
}>
const PromptSection = ({ seed }: PromptSelectionProps) => {
    const [prompt, setPrompt] = useState<Prompt>({ raw: "" });
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPrompt((current: Prompt) => {
            return { ...current, raw: e.target.value };
        });
    }, [setPrompt, prompt]);
    return (
        <div>
            <Textarea label="Prompt" value={prompt.raw} placeholder="Enter your prompt..." onChange={handleChange} />
            <div>
                {
                    prompt.img && (
                        <Image src={prompt.img.src} width={100} height={100} alt={"Generated image."} />
                    )
                }
            </div>
            <Button>Start</Button>
        </div>
    )
}

export default function Home() {
    const [seed, setSeed] = useState<string>("238974897213723");
    return (
        <div>
            <PromptSection seed={seed} />
            <a href="/api/auth/sign-out">Sign Out</a>
        </div>
    );
}
