'use client'

import { Button, Checkbox, CheckboxGroup, NumberInput, Select, SelectItem, Slider, Tab, Tabs, Textarea } from "@heroui/react";
import Image from "next/image";
import { Key, useCallback, useEffect, useMemo, useState } from "react";
import Form from 'next/form'
import { generate } from "../actions/generate";
import { Comparison, GenerateActionState, GenerateState, Generation, Medium, Race } from "../../types";
import generator_icon from '@/public/generator_icon.png';


const races: { race: Race }[] = [
    { race: "Tai Kadi" },
    { race: "Asian" },
    { race: "African American" },
    { race: "Caucasion" },
    { race: "Hispanic" },
    { race: "Korean" },
];
//<SelectItem>{"Asion" as Race}</SelectItem>
//<SelectItem>{"Tai Kadi" as Race}</SelectItem>
//<SelectItem>{"Caucasion" as Race}</SelectItem>
//<SelectItem>{"African American" as Race}</SelectItem>
//<SelectItem>{"Hispanic" as Race}</SelectItem>
//<SelectItem>{"Korean" as Race}</SelectItem>

type PromptSelectionProps = Readonly<{
    generation?: Generation;
    seed: string;
}>
const PromptSection = ({ generation: gen, seed }: PromptSelectionProps) => {
    const readonly = useMemo(() => !!gen, [gen])
    const [generation, setGeneration] = useState<Generation | undefined>(gen);
    const [pending, setPending] = useState(false);
    const handleAction = useCallback(async (data: FormData) => {
        try {
            if (generation) {
                const prompt = data.get("prompt");
                if (!prompt) return;
                setPending(true);
                let current_generation = generation;
                current_generation.prompt = prompt as string;
                await generate(current_generation);
            } else {
                console.error("Could not get a generation.");
            }
        } catch (e: any) {
            console.log(e);
        } finally {
            setPending(false);
        }
    }, [generation]);
    useEffect(() => {
        if (!generation) {
            setGeneration({ seed: seed, options: {} } as Generation)
        }
    }, [])
    useEffect(() => {
        console.log(generation);
    }, [generation])
    return (
        <Form action={handleAction} className="flex h-full flex-col gap-3" >
            <Textarea isDisabled={readonly} name="prompt" label="Prompt" isRequired={true} variant="bordered" color="primary" placeholder={generation?.prompt} />
            <p>Medium</p>
            <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, medium: v } }))} defaultValue={generation?.options.medium ?? []} isDisabled={readonly} orientation="horizontal">
                <Checkbox value="Digital Illustration">Digital Illustration</Checkbox>
                <Checkbox value="Photograph">Photograph</Checkbox>
                <Checkbox value="3D Render">3D Render</Checkbox>
                <Checkbox value="Concept Art">Concept Art</Checkbox>
                <Checkbox value="Poster">Poster</Checkbox>
            </CheckboxGroup>
            <p>Genre</p>
            <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, genre: v } }))} isDisabled={readonly} defaultValue={generation?.options.genre ?? []} orientation="horizontal">
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
                <Select onChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, physical_attributes: { ...g.options.physical_attributes, race: v.target.value } } }))} items={races} placeholder={generation?.options.physical_attributes?.race ?? "Race"} isDisabled={readonly} size="lg">
                    {(item) => (
                        <SelectItem key={item.race}>{item.race}</SelectItem>
                    )}
                </Select>
                <Select onChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, physical_attributes: { ...g.options.physical_attributes, clothing: v.target.value } } }))} placeholder="Clothing" isDisabled={readonly} size="lg">
                    <SelectItem key={"Clothing"}>Clothing</SelectItem>
                </Select>
            </div>
            <NumberInput onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, physical_attributes: { ...g.options.physical_attributes, age: v } } }))} placeholder={generation?.options.physical_attributes?.age && generation?.options.physical_attributes.age.toString() ?? ""} isDisabled={readonly} className="" size="sm" />
            <p>Mood</p>
            <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, mood: v } }))} defaultValue={generation?.options.mood ?? []} isDisabled={readonly} orientation="horizontal">
                <Checkbox value="Beautiful">Beautiful</Checkbox>
                <Checkbox value="Eerie">Eerie</Checkbox>
                <Checkbox value="Bleak">Bleak</Checkbox>
                <Checkbox value="Ugly">Ugly</Checkbox>
                <Checkbox value="Calm">Calm</Checkbox>
            </CheckboxGroup>
            <p>Technique</p>
            <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, technique: v } }))} defaultValue={generation?.options.technique ?? []} isDisabled={readonly} orientation="horizontal">
                <Checkbox value="Blender">Blender</Checkbox>
                <Checkbox value="Pincusion Lens">Pincushion Lens</Checkbox>
                <Checkbox value="Unreal Engine">Unreal Engine</Checkbox>
                <Checkbox value="Octane">Octane</Checkbox>
            </CheckboxGroup>
            <p>Lighting</p>
            <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, lighting: v } }))} defaultValue={generation?.options.lighting ?? []} isDisabled={readonly} orientation="horizontal">
                <Checkbox value="Cinematic Lighting">Cinematic Lighting</Checkbox>
                <Checkbox value="Dark">Dark</Checkbox>
                <Checkbox value="Realistic Shaded Lighting">Realistic Shaded Lighting</Checkbox>
                <Checkbox value="Studio Lighting">Studio Lighting</Checkbox>
                <Checkbox value="Radiant Light">Radiant Light</Checkbox>
            </CheckboxGroup>
            <p>Resolution</p>
            <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, resolution: v } }))} isDisabled={readonly} defaultValue={generation?.options.resolution ?? []} orientation="horizontal">
                <Checkbox value="Highly-Detailed">Highly-Detailed</Checkbox>
                <Checkbox value="Photorealistic">Photorealistic</Checkbox>
                <Checkbox value="100 mm">100 mm</Checkbox>
                <Checkbox value="8K">8K</Checkbox>
                <Checkbox value="16K">16K</Checkbox>
                <Checkbox value="HQ">HQ</Checkbox>
                <Checkbox value="Sharp Focus">Sharp Focus</Checkbox>
            </CheckboxGroup>
            {
                !readonly && <Button isDisabled={readonly} variant='bordered' color="primary" type='submit' isLoading={pending}>{pending ? "Generating..." : "Generate"}</Button>
            }
        </Form>
    )
}

type CompareProps = Readonly<{
    comparison: Comparison;
}>
export default function Compare({ comparison }: CompareProps) {
    const [key, setKey] = useState<Key>();
    return (
        <div className="relative @container h-full flex flex-col justify-center gap-[1rem] w-full max-w-[800px]">
            <h1 className="text-xl font-light">Compare</h1>
            <div className="flex content-center items-center gap-[1rem]">
                <h1>Seed: {comparison.seed}</h1>
            </div>
            <Tabs onSelectionChange={setKey}>
                <Tab title="Output" key="output"></Tab>
                <Tab title="LRP" key="lrp"></Tab>
                <Tab title="Log LRP" key="loglrp"></Tab>
            </Tabs>
            <div className="flex w-full gap-[1rem] relative">
                <div className="flex flex-col gap-[1rem]">
                    <div className="w-full h-60 rounded-[10px] border-1 border-zinc-200">
                        <Image src={key == "output" ? comparison?.generation_a?.output ?? generator_icon : key == "lrp" ? comparison?.generation_a?.output_lrp ?? generator_icon : comparison?.generation_a?.output_log_lrp ?? generator_icon} alt={"Generated image."} className='object-contain h-full' />
                    </div>
                    <PromptSection generation={comparison?.generation_a} seed={comparison.seed} />
                </div>

                <div className="flex flex-col gap-[1rem]">
                    <div className="w-full h-60 rounded-[10px] border-1 border-zinc-200">
                        <Image src={key == "output" ? comparison?.generation_b?.output ?? generator_icon : key == "lrp" ? comparison?.generation_b?.output_lrp ?? generator_icon : comparison?.generation_b?.output_log_lrp ?? generator_icon} alt={"Generated image."} className='object-contain h-full' />
                    </div>
                    <PromptSection generation={comparison?.generation_b} seed={comparison.seed} />
                </div>
            </div>
        </div >
    );
}
