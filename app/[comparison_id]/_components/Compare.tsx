'use client'

import { Accordion, AccordionItem, Button, Checkbox, CheckboxGroup, NumberInput, Select, SelectItem, Slider, Tab, Tabs, Textarea } from "@heroui/react";
import { Key, useCallback, useEffect, useMemo, useState } from "react";
import { generate } from "../actions/generate";
import { Comparison, GenerateActionState, GenerateState, Generation, Medium, Race } from "../../types";
import generator_icon from '@/public/generator_icon.png';
import styles from "./Compare.module.css";


function toDataUrl(b64: string, mime = "image/png") {
    return `data:${mime};base64,${b64}`;
}
function dataURLtoBlob(dataUrl: string): Promise<Blob> {
    // Fastest cross-browser: fetch the data URL and turn it into a Blob
    return fetch(dataUrl).then(res => res.blob());
}

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
    id: string;
    onGenerate: (generation: Generation) => void;
}>
const PromptSection = ({ onGenerate, generation: gen, seed, id }: PromptSelectionProps) => {
    const readonly = useMemo(() => gen?.id ? true : false, [gen])
    const [generation, setGeneration] = useState<Generation | undefined>(gen);
    const [pending, setPending] = useState(false);
    const handleAction = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (generation) {
                const data = new FormData(e.target as HTMLFormElement);
                const prompt = data.get("prompt");
                if (!prompt) return;
                setPending(true);
                let current_generation = structuredClone(generation);
                current_generation.prompt = prompt as string;
                let res = await generate(current_generation, id);
                if (res.data) {
                    current_generation.output = toDataUrl(res.data[0]);
                    current_generation.output_lrp = toDataUrl(res.data[1]);
                    current_generation.prompt = res.prompt as string;
					generation.id = "new";
                    onGenerate(current_generation);
                }
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
        } else {
            setGeneration({ ...gen } as Generation);
        }
    }, [gen])
    useEffect(() => {
        console.log(generation);
        console.log(generation?.options?.physical_attributes?.age?.toString());
    }, [generation])
    return (
        <form onSubmit={handleAction} className="flex h-full flex-col gap-3">
            <Textarea isDisabled={readonly} name="prompt" label="Prompt" isRequired={true} variant="bordered" color="primary" placeholder={generation?.prompt} />
            <Accordion className='w-full' selectionMode="multiple">
                <AccordionItem title="Medium">
                    <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, medium: v } }))} defaultValue={gen?.options?.medium ?? generation?.options.medium ?? []} isDisabled={readonly} orientation="horizontal">
                        <Checkbox value="Digital Illustration">Digital Illustration</Checkbox>
                        <Checkbox value="Photograph">Photograph</Checkbox>
                        <Checkbox value="3D Render">3D Render</Checkbox>
                        <Checkbox value="Concept Art">Concept Art</Checkbox>
                        <Checkbox value="Poster">Poster</Checkbox>
                    </CheckboxGroup>
                </AccordionItem>
                <AccordionItem title="Genre">
                    <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, genre: v } }))} isDisabled={readonly} defaultValue={gen?.options.genre ?? generation?.options.genre ?? []} orientation="horizontal">
                        <Checkbox value="Anime">Anime</Checkbox>
                        <Checkbox value="Surreal">Surreal</Checkbox>
                        <Checkbox value="Baroque">Baropue</Checkbox>
                        <Checkbox value="Photorealistic">Photorealistic</Checkbox>
                        <Checkbox value="Sci-Fi">Sci-Fi</Checkbox>
                        <Checkbox value="Black & White">Black &amp; White</Checkbox>
                        <Checkbox value="Fantasy">Fantasy</Checkbox>
                        <Checkbox value="Film Noir">Film Noir</Checkbox>
                    </CheckboxGroup>
                </AccordionItem>
                <AccordionItem title="Physical Attributes">
                    <div className="flex gap-5 items-center content-center">
                        <Select onChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, physical_attributes: { ...g.options.physical_attributes, race: v.target.value } } }))} items={races} placeholder={gen?.options.physical_attributes?.race ?? generation?.options.physical_attributes?.race ?? "Race"} isDisabled={readonly} size="lg">
                            {(item) => (
                                <SelectItem key={item.race}>{item.race}</SelectItem>
                            )}
                        </Select>
                        <Select onChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, physical_attributes: { ...g.options.physical_attributes, clothing: v.target.value } } }))} placeholder="Clothing" isDisabled={readonly} size="lg">
                            <SelectItem key={"Clothing"}>Clothing</SelectItem>
                        </Select>
                    </div>
                    <NumberInput onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, physical_attributes: { ...g.options.physical_attributes, age: v } } }))} placeholder={generation?.options?.physical_attributes?.age && generation?.options?.physical_attributes?.age?.toString().length > 0 ? gen?.options.physical_attributes?.age?.toString() ?? generation?.options?.physical_attributes?.age?.toString() : ""} isDisabled={readonly} className="" size="sm" />
                </AccordionItem>
                <AccordionItem title="Mood">
                    <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, mood: v } }))} defaultValue={gen?.options.mood ?? generation?.options.mood ?? []} isDisabled={readonly} orientation="horizontal">
                        <Checkbox value="Beautiful">Beautiful</Checkbox>
                        <Checkbox value="Eerie">Eerie</Checkbox>
                        <Checkbox value="Bleak">Bleak</Checkbox>
                        <Checkbox value="Ugly">Ugly</Checkbox>
                        <Checkbox value="Calm">Calm</Checkbox>
                    </CheckboxGroup>
                </AccordionItem>
                <AccordionItem title="Technique">
                    <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, technique: v } }))} defaultValue={gen?.options.technique ?? generation?.options.technique ?? []} isDisabled={readonly} orientation="horizontal">
                        <Checkbox value="Blender">Blender</Checkbox>
                        <Checkbox value="Pincushion Lens">Pincushion Lens</Checkbox>
                        <Checkbox value="Unreal Engine">Unreal Engine</Checkbox>
                        <Checkbox value="Octane">Octane</Checkbox>
                    </CheckboxGroup>
                </AccordionItem>
                <AccordionItem title="Lighting">
                    <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, lighting: v } }))} defaultValue={gen?.options.lighting ?? generation?.options.lighting ?? []} isDisabled={readonly} orientation="horizontal">
                        <Checkbox value="Cinematic Lighting">Cinematic Lighting</Checkbox>
                        <Checkbox value="Dark">Dark</Checkbox>
                        <Checkbox value="Realistic Shaded Lighting">Realistic Shaded Lighting</Checkbox>
                        <Checkbox value="Studio Lighting">Studio Lighting</Checkbox>
                        <Checkbox value="Radiant Light">Radiant Light</Checkbox>
                    </CheckboxGroup>
                </AccordionItem>
                <AccordionItem title="Resolution">
                    <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, resolution: v } }))} isDisabled={readonly} defaultValue={gen?.options.resolution ?? generation?.options.resolution ?? []} orientation="horizontal">
                        <Checkbox value="Highly-Detailed">Highly-Detailed</Checkbox>
                        <Checkbox value="Photorealistic">Photorealistic</Checkbox>
                        <Checkbox value="100 mm">100 mm</Checkbox>
                        <Checkbox value="8K">8K</Checkbox>
                        <Checkbox value="16K">16K</Checkbox>
                        <Checkbox value="HQ">HQ</Checkbox>
                        <Checkbox value="Sharp Focus">Sharp Focus</Checkbox>
                    </CheckboxGroup>
                </AccordionItem>
            </Accordion>
            {
                !readonly && <Button isDisabled={readonly} variant='bordered' color="primary" type='submit' isLoading={pending}>{pending ? "Generating..." : "Generate"}</Button>
            }
        </form >
    )
}

//seed: string;
//output: any;
//output_log_lrp: any;
//output_lrp: any;
//prompt: string;
//options: {
type CompareProps = Readonly<{
    comparison: Comparison;
}>
export default function Compare({ comparison: _comparison }: CompareProps) {
    const [comparison, setComparison] = useState(_comparison);
    const [key, setKey] = useState<Key>();
    const handleOnGenerateA = useCallback((generation: Generation) => {
        setComparison(prev => ({
            ...prev,
            generation_a: generation
        }));
    }, [comparison, setComparison]);
    const handleOnGenerateB = useCallback((generation: Generation) => {
        setComparison(prev => ({
            ...prev,
            generation_b: generation
        }));
    }, [comparison, setComparison]);

    return (
        <div className="relative @container h-full flex flex-col justify-center gap-[1rem] w-full max-w-[800px]">
            <h1 className="text-xl font-light">Compare</h1>
            <div className="flex content-center items-center gap-[1rem]">
                <h1>Seed: {comparison.seed}</h1>
            </div>
            <Tabs onSelectionChange={setKey}>
                <Tab title="Output" key="output"></Tab>
                <Tab title="LRP" key="lrp"></Tab>
            </Tabs>
            <div className="flex w-full gap-[1rem] relative">
                <div className="flex flex-col gap-[1rem] basis-[50%]">
                    <div className="w-full h-60 rounded-[10px] border-1 border-zinc-200">
                        <img src={key == "output" ? comparison?.generation_a?.output ?? generator_icon.src : key == "lrp" ? comparison?.generation_a?.output_lrp ?? generator_icon.src : generator_icon.src} alt={"Generated image."} className={styles.result_image} />
                    </div>
                    <PromptSection id={comparison.id as string} onGenerate={handleOnGenerateA} generation={comparison?.generation_a} seed={comparison.seed} />
                </div>

                <div className="flex flex-col gap-[1rem] basis-[50%]">
                    <div className="w-full h-60 rounded-[10px] border-1 border-zinc-200">
                        <img src={key == "output" ? comparison?.generation_b?.output ?? generator_icon.src : key == "lrp" ? comparison?.generation_b?.output_lrp ?? generator_icon.src : generator_icon.src} alt={"Generated image."} className={styles.result_image} />
                    </div>
                    <PromptSection id={comparison.id as string} onGenerate={handleOnGenerateB} generation={comparison?.generation_b} seed={comparison.seed} />
                </div>
            </div>
        </div >
    );
}
