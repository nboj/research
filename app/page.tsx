'use client'

import { Button, Select, SelectItem, Tab, Tabs, Textarea } from "@heroui/react";
import Image from "next/image";
import { Key, useActionState, useCallback, useEffect, useState } from "react";
import Form from 'next/form'
import { generate } from "./actions/generate";
import { GenerateActionState, GenerateState } from "./types";
import generator_icon from '@/public/generator_icon.png';
import { FiRefreshCcw } from "react-icons/fi";

import Link from "next/link";

const DEFAULT_STATE: GenerateActionState = {
        state: GenerateState.PENDING
}

type PromptSelectionProps = Readonly<{
        seed: string;
        selection?: Key;
}>
const PromptSection = ({ seed, selection }: PromptSelectionProps) => {
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
                        {
                                selection == "output" && (
                                        <div className="w-full h-60 rounded-[10px] border-1 border-zinc-200">
                                                <Image src={generator_icon} alt={"Generated image."} className='object-contain h-full' />
                                        </div>

                                )
                        }
                        <Textarea name="prompt" label="Prompt" isRequired={true} variant="bordered" color="primary" placeholder="Enter your prompt..." />
                        <div className="flex gap-5">
                                <Select placeholder="Seleeeect">
                                        <SelectItem>tnaiorsen</SelectItem>
                                </Select>
                                <Select placeholder="Seleeeect">
                                        <SelectItem>tnaiorsen</SelectItem>
                                </Select>
                                <Select placeholder="Seleeeect">
                                        <SelectItem>tnaiorsen</SelectItem>
                                </Select>
                        </div>
                        <Button variant='bordered' color="primary" type='submit' isLoading={pending}>{pending ? "Generating..." : "Generate"}</Button>
                </Form>
        )
}

export default function Home() {
        const [seed, setSeed] = useState<string>("");
        const [key, setKey] = useState<Key>();
        useEffect(() => {
                handleSeedRefresh();
        }, [setSeed])
        const handleSeedRefresh = useCallback(() => {
                setSeed(crypto.randomUUID());
        }, [setSeed])
        return (
                <div className="relative @container h-full flex flex-col justify-center gap-[1rem] max-w-[800px] m-auto">
                        <h1 className="text-xl font-light">Compare</h1>
                        <div className="flex content-center items-center gap-[1rem]">
                                <h1>Seed: {seed}</h1>
                                <Button isIconOnly variant="light" onPress={handleSeedRefresh}><FiRefreshCcw /></Button>
                        </div>
                        <Tabs onSelectionChange={setKey}>
                                <Tab title="Output" key="output"></Tab>
                                <Tab title="LRP" key="lrp"></Tab>
                                <Tab title="Log LRP" key="loglrp"></Tab>
                        </Tabs>
                        <div className="flex w-full gap-[1rem] relative">
                                <PromptSection seed={seed} selection={key} />
                                <span className="self-stretch bg-zinc-300 mb-10 w-[2px]"></span>
                                <PromptSection seed={seed} selection={key} />
                        </div>
                        <Link href='/api/auth/sign-out'>Sign Out</Link>
                </div>
        );
}
