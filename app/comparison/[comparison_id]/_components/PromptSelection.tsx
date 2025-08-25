'use client'

import { Accordion, AccordionItem, Button, Checkbox, CheckboxGroup, NumberInput, Select, SelectItem, Slider, Tab, Tabs, Textarea } from "@heroui/react";
import { Key, useCallback, useEffect, useMemo, useState } from "react";
import { generate } from "../actions/generate";
import { Comparison, GenerateActionState, GenerateState, Generation, Medium, Race } from "../../../types";
import generator_icon from '@/public/generator_icon.png';
import styles from "./PromptSelection.module.css";

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

//seed: string;
//output: any;
//output_log_lrp: any;
//output_lrp: any;
//prompt: string;
//options: {

type PromptSelectionProps = Readonly<{
    generation?: Generation;
    seed: string;
    id: string;
}>
export default function PromptSection({ generation: gen, seed, id }: PromptSelectionProps) {
    const readonly = useMemo(() => gen?.output ? true : false, [gen])
    const [generation, setGeneration] = useState<Generation | undefined>(gen);
    const [pending, setPending] = useState(false);
    const [currentToken, setCurrentToken] = useState<number>(0);
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
                    current_generation.output = toDataUrl(res.data.images[0]);
                    current_generation.output_lrp = toDataUrl(res.data.images[1]);
                    current_generation.prompt = res.prompt as string;
                    generation.id = "new";
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
        <form onSubmit={handleAction} className="flex w-full h-full flex-col gap-3">
            {

                readonly ? (
                    <div>
                        <div className="w-full h-60 rounded-[10px] border-1 border-zinc-200">
                            <img src={generation?.images[currentToken]} className={styles.result_image} />
                        </div>
                        <p>Selected: {generation?.tokens[currentToken]}</p>
                        <div className={"flex flex-wrap"}>
                            {

                                generation?.tokens.map((token: string, index: number) => (
                                    <span className={`${styles.token} ${index == currentToken && styles.selected}`} key={`${token}-${index}`} onClick={() => setCurrentToken(index)}>
                                        {!token.match(/[.!?,:;]$/) ? <>&nbsp;</> : ''}
                                        {token}
                                    </span>
                                ))

                            }
                        </div>
                    </div>
                ) : (
                    <Textarea isDisabled={readonly} name="prompt" label="Prompt" isRequired={true} variant="bordered" color="primary" placeholder={generation?.prompt} />
                )
            }
            <div className={styles.outer_options_container}>

                <Accordion className={styles.options_container} selectionMode="multiple" defaultExpandedKeys={["Medium", "Genre", "PA"]}>
                    <AccordionItem title="Medium" key="Medium">
                        <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, medium: v } }))} defaultValue={gen?.options?.medium ?? generation?.options.medium ?? []} isDisabled={readonly} orientation="horizontal">
                            <Checkbox value="Digital Illustration">Digital Illustration</Checkbox>
                            <Checkbox value="Photograph">Photograph</Checkbox>
                            <Checkbox value="3D Render">3D Render</Checkbox>
                            <Checkbox value="Concept Art">Concept Art</Checkbox>
                            <Checkbox value="Poster">Poster</Checkbox>
                        </CheckboxGroup>
                    </AccordionItem>
                    <AccordionItem title="Genre" key="Genre">
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
                    <AccordionItem title="Physical Attributes" key="PA">
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
                    <AccordionItem title="Mood" key="Mood">
                        <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, mood: v } }))} defaultValue={gen?.options.mood ?? generation?.options.mood ?? []} isDisabled={readonly} orientation="horizontal">
                            <Checkbox value="Beautiful">Beautiful</Checkbox>
                            <Checkbox value="Eerie">Eerie</Checkbox>
                            <Checkbox value="Bleak">Bleak</Checkbox>
                            <Checkbox value="Ugly">Ugly</Checkbox>
                            <Checkbox value="Calm">Calm</Checkbox>
                        </CheckboxGroup>
                    </AccordionItem>
                </Accordion>
                <Accordion className={styles.options_container} selectionMode="multiple" defaultExpandedKeys={["Mood", "Technique", "Lighting"]}>
                    <AccordionItem title="Technique" key="Technique">
                        <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, technique: v } }))} defaultValue={gen?.options.technique ?? generation?.options.technique ?? []} isDisabled={readonly} orientation="horizontal">
                            <Checkbox value="Blender">Blender</Checkbox>
                            <Checkbox value="Pincushion Lens">Pincushion Lens</Checkbox>
                            <Checkbox value="Unreal Engine">Unreal Engine</Checkbox>
                            <Checkbox value="Octane">Octane</Checkbox>
                        </CheckboxGroup>
                    </AccordionItem>
                    <AccordionItem title="Lighting" key="Lighting">
                        <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, lighting: v } }))} defaultValue={gen?.options.lighting ?? generation?.options.lighting ?? []} isDisabled={readonly} orientation="horizontal">
                            <Checkbox value="Cinematic Lighting">Cinematic Lighting</Checkbox>
                            <Checkbox value="Dark">Dark</Checkbox>
                            <Checkbox value="Realistic Shaded Lighting">Realistic Shaded Lighting</Checkbox>
                            <Checkbox value="Studio Lighting">Studio Lighting</Checkbox>
                            <Checkbox value="Radiant Light">Radiant Light</Checkbox>
                        </CheckboxGroup>
                    </AccordionItem>
                    <AccordionItem title="Resolution" key="Resolution">
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
                    <AccordionItem title="Setting" key="Setting">
                        <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, setting: v } }))} isDisabled={readonly} defaultValue={gen?.options.setting ?? generation?.options.setting ?? []} orientation="horizontal">
                            <Checkbox value="Desert">Desert</Checkbox>
                            <Checkbox value="Forest">Forest</Checkbox>
                            <Checkbox value="City">City</Checkbox>
                            <Checkbox value="Suburban">Suburban</Checkbox>
                            <Checkbox value="Antarctica">Antarctica</Checkbox>
                            <Checkbox value="Caribbean">Caribbean</Checkbox>
                            <Checkbox value="Mars">Mars</Checkbox>
                        </CheckboxGroup>
                    </AccordionItem>
                    <AccordionItem title="Angle" key="Angle">
                        <CheckboxGroup onValueChange={(v) => setGeneration((g: any) => ({ ...g, options: { ...g.options, setting: v } }))} isDisabled={readonly} defaultValue={gen?.options.setting ?? generation?.options.setting ?? []} orientation="horizontal">
                            <Checkbox value="Ultra Wide">Ultra Wide</Checkbox>
                            <Checkbox value="Zenith View">Zenith View</Checkbox>
                            <Checkbox value="Cinematic View">Cinematic View</Checkbox>
                            <Checkbox value="Close Up">Close Up</Checkbox>
                        </CheckboxGroup>
                    </AccordionItem>
                </Accordion>
            </div>
            {
                !readonly && <Button isDisabled={readonly} variant='bordered' color="primary" type='submit' isLoading={pending}>{pending ? "Generating..." : "Generate"}</Button>
            }
        </form >
    )
}
