'use client'

import { Textarea } from "@heroui/react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useCallback, useState } from "react";

type Prompt = {
    raw: string;
    img?: {
        src: string;
    }
}

type PromptSelectionProps = Readonly<{
    disabled: boolean;
    onChange: (newPrompt: Prompt) => void;
}>
const PromptSection = ({ disabled, onChange }: PromptSelectionProps) => {
    const [prompt, setPrompt] = useState<Prompt>({ raw: "" });
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...prompt, raw: e.target.value });
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
        </div>
    )
}

export default function Home() {
    const [prompt1, setPrompt1] = useState<Prompt>({ raw: "" });
    const [prompt2, setPrompt2] = useState<Prompt>({ raw: "" });
    return (
        <div>
            <PromptSection disabled onChange={(newPrompt: Prompt) => setPrompt1(newPrompt)} />
            <a href="/api/auth/sign-out">Sign Out</a>
        </div>
    );
}
