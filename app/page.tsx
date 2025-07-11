'use client'

import { Button, Checkbox, CheckboxGroup, NumberInput, Select, SelectItem, Tab, Tabs, Textarea } from "@heroui/react";
import Image from "next/image";
import { Key, useActionState, useCallback, useEffect, useState } from "react";
import Form from 'next/form'
import { generate } from "./actions/generate";
import { GenerateActionState, GenerateState } from "./types";
import generator_icon from '@/public/generator_icon.png';
import { FiRefreshCcw } from "react-icons/fi";

import result_alrp from "@/public/results/1/alrp.png"
import result_aloglrp from "@/public/results/1/aloglrp.png"
import result_a from "@/public/results/1/a.png"
import result_blrp from "@/public/results/1/blrp.png"
import result_bloglrp from "@/public/results/1/bloglrp.png"
import result_b from "@/public/results/1/b.png"

import Link from "next/link";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

const DEFAULT_STATE: GenerateActionState = {
        state: GenerateState.PENDING
}

type PromptSelectionProps = Readonly<{
        seed: string;
        selection?: Key;
        result: StaticImport;
}>
const PromptSection = ({ seed, selection, result }: PromptSelectionProps) => {
        const [actionState, action, pending] = useActionState(generate, DEFAULT_STATE);
        if (actionState.state == GenerateState.ERROR) {
                return (
                        <div>
                                <h1 className="text-md">Uh Oh... Something went wrong, please reload the page.</h1>
                        </div>
                )
        }
        return (
                <Form action={action} className="flex h-full flex-col gap-3" >
                        <div className="w-full h-60 rounded-[10px] border-1 border-zinc-200">
                                <Image src={result} alt={"Generated image."} className='object-contain h-full' />
                        </div>

                        <Textarea isDisabled name="prompt" label="Prompt" isRequired={true} variant="bordered" color="primary" placeholder="Enter your prompt..." />
                        <p>Medium</p>
                        <CheckboxGroup defaultValue={["Photograph"]} isDisabled orientation="horizontal">
                                <Checkbox value="Digital Illustration">Digital Illustration</Checkbox>
                                <Checkbox value="Photograph">Photograph</Checkbox>
                                <Checkbox value="3D Render">3D Render</Checkbox>
                                <Checkbox value="Concept Art">Concept Art</Checkbox>
                                <Checkbox value="Poster">Poster</Checkbox>
                        </CheckboxGroup>
                        <p>Genre</p>
                        <CheckboxGroup isDisabled defaultValue={["Surreal", "Photorealistic", "Fantasy"]} orientation="horizontal">
                                <Checkbox value="Anime">Anime</Checkbox>
                                <Checkbox value="Surreal">Surreal</Checkbox>
                                <Checkbox value="Baroque">Baropue</Checkbox>
                                <Checkbox value="Photorealistic">Photorealistic</Checkbox>
                                <Checkbox value="Sci-Fi">Sci-Fi</Checkbox>
                                <Checkbox value="Black & White">Black &amp; White</Checkbox>
                                <Checkbox value="Fantasy">Fantasy</Checkbox>
                                <Checkbox value="Film Noir">Film Noir</Checkbox>
                        </CheckboxGroup>
                        <p>Physical Attributes</p>
                        <div className="flex gap-5 items-center content-center">
                                <Select placeholder="Tai-Kadi" isDisabled size="lg">
                                        <SelectItem>White</SelectItem>
                                        <SelectItem>Black</SelectItem>
                                        <SelectItem>Tai-Kadi</SelectItem>
                                </Select>
                                <NumberInput placeholder="Age" className="" size="sm" />
                                <Select placeholder="Clothing" size="lg">
                                        <SelectItem>Clothing</SelectItem>
                                </Select>
                        </div>
                        <p>Mood</p>
                        <CheckboxGroup isDisabled orientation="horizontal">
                                <Checkbox value="Anime">Beautiful</Checkbox>
                                <Checkbox value="Surreal">Eerie</Checkbox>
                                <Checkbox value="Baroque">Bleak</Checkbox>
                                <Checkbox value="Photorealistic">Ugly</Checkbox>
                                <Checkbox value="Sci-Fi">Calm</Checkbox>
                        </CheckboxGroup>
                        <p>Technique</p>
                        <CheckboxGroup isDisabled orientation="horizontal">
                                <Checkbox value="Blender">Blender</Checkbox>
                                <Checkbox value="Pincusion Lens">Pincushion Lens</Checkbox>
                                <Checkbox value="Unreal Engine">Unreal Engine</Checkbox>
                                <Checkbox value="Octane">Octane</Checkbox>
                        </CheckboxGroup>
                        <p>Lighting</p>
                        <CheckboxGroup isDisabled orientation="horizontal">
                                <Checkbox value="Blender">Cinematic Lighting</Checkbox>
                                <Checkbox value="Pincusion Lens">Dark</Checkbox>
                                <Checkbox value="Unreal Engine">Realistic Shaded Lighting</Checkbox>
                                <Checkbox value="Octane">Studio Lighting</Checkbox>
                                <Checkbox value="Octane">Radiant Light</Checkbox>
                        </CheckboxGroup>
                        <p>Resolution</p>
                        <CheckboxGroup isDisabled orientation="horizontal">
                                <Checkbox value="Blender">Highly-Detailed</Checkbox>
                                <Checkbox value="Pincusion Lens">Photorealistic</Checkbox>
                                <Checkbox value="Unreal Engine">100 mm</Checkbox>
                                <Checkbox value="Octane">8K</Checkbox>
                                <Checkbox value="Octane">16K</Checkbox>
                                <Checkbox value="Octane">HQ</Checkbox>
                                <Checkbox value="Octane">Sharp Focus</Checkbox>
                        </CheckboxGroup>
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
                <div className="flex w-full justify-center gap-[2rem] m-auto">
                        <div className="relative @container h-full flex flex-col justify-center gap-[1rem] w-full max-w-[800px]">
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
                                        <PromptSection seed={seed} selection={key} result={key == "output" ? result_a : key == "lrp" ? result_alrp : result_aloglrp} />
                                        <PromptSection seed={seed} selection={key} result={key == "output" ? result_b : key == "lrp" ? result_blrp : result_bloglrp} />
                                </div>
                                <Link href='/api/auth/sign-out'>Sign Out</Link>
                        </div>
                        <div className="flex flex-col">
                                <div className="w-[10rem] flex">
                                        <Image src={result_a} alt={"Generated image."} className='object-contain h-full rounded-md' />
                                        <Image src={result_b} alt={"Generated image."} className='object-contain h-full rounded-md' />
                                </div>
                                <div className="w-[10rem] flex">
                                        <Image src={generator_icon} alt={"Generated image."} className='object-contain h-full' />
                                        <Image src={generator_icon} alt={"Generated image."} className='object-contain h-full' />
                                </div>
                                <div className="w-[10rem] flex">
                                        <Image src={generator_icon} alt={"Generated image."} className='object-contain h-full' />
                                        <Image src={generator_icon} alt={"Generated image."} className='object-contain h-full' />
                                </div>
                                <div className="w-[10rem] flex">
                                        <Image src={generator_icon} alt={"Generated image."} className='object-contain h-full' />
                                        <Image src={generator_icon} alt={"Generated image."} className='object-contain h-full' />
                                </div>
                        </div>
                </div>
        );
}
