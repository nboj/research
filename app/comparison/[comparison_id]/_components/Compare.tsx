"use client";

import { Comparison, Generation } from "../../../types";
import Image from "next/image";
import styles from "./Compare.module.css";
import { useContext, useEffect, useState } from "react";
import { Button, Link, Spinner } from "@heroui/react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { SocketContext } from "@/app/Providers";
import { usePathname } from "next/navigation";
import { update } from "../actions/update";

interface OptionItemProps {
    title: string;
    body: string;
}
const OptionItem = ({ title, body }: OptionItemProps) => {
    return (
        <p className="flex gap-[.5rem]">
            <span className="font-bold">{title}: </span>
            <span className="flex gap-[.5rem]">{body}</span>
        </p>
    );
};

interface CompareGenerationProps {
    generation: Generation;
    other?: Generation;
}
const CompareGeneration = ({ generation, other }: CompareGenerationProps) => {
    const [currentToken, setCurrentToken] = useState(0);
    console.log(generation);
    if (generation?.output) {
        return (
            <div className={styles.generation}>
                <div>
                    <h1 className="text-xl">
                        {generation?.index == 0 ? "Generation A" : "Generation B"}
                    </h1>
                    <div className={styles.result_container}>
                        <div className={styles.result}>
                            <img
                                src={generation.output}
                                className={styles.result_image}
                                alt=""
                            />
                        </div>
                        <div className={styles.result}>
                            <img
                                src={generation?.images[currentToken]}
                                className={`${styles.result_image} ${styles.daam_image}`}
                                alt={""}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <p>
                        Selected: {generation?.tokens && generation.tokens[currentToken]}
                    </p>
                    <div className={"flex flex-wrap"}>
                        {generation?.tokens &&
                            generation.tokens.map((token: string, index: number) => {
                                let found = (other?.tokens?.length ?? 0 > 0) ? false : true;
                                other?.tokens?.forEach((tok) => {
                                    if (tok === token) {
                                        found = true;
                                    }
                                });
                                return (
                                    <span
                                        className={`${styles.token} ${!found && styles.token_diff} ${index == currentToken && styles.selected}`}
                                        key={`${token}-${index}`}
                                        onClick={() => setCurrentToken(index)}
                                    >
                                        &nbsp;{token}
                                    </span>
                                );
                            })}
                    </div>
                </div>
                <div>
                    {generation.options.medium &&
                        generation.options.medium.length > 0 && (
                            <OptionItem
                                title="Medium"
                                body={generation.options.medium?.join(", ") as ""}
                            />
                        )}
                    {generation.options.genre && generation.options.genre.length > 0 && (
                        <OptionItem
                            title="Genre"
                            body={generation.options.genre?.join(", ") as ""}
                        />
                    )}
                    {generation.options.physical_attributes && (
                        <OptionItem
                            title="Physical Attributes"
                            body={[
                                `${generation.options.physical_attributes?.age} years old`,
                                generation.options.physical_attributes?.race,
                            ].join(", ")}
                        />
                    )}
                    {generation.options.mood && generation.options.mood.length > 0 && (
                        <OptionItem
                            title="Mood"
                            body={generation.options.mood?.join(", ") as ""}
                        />
                    )}
                    {generation.options.technique &&
                        generation.options.technique.length > 0 && (
                            <OptionItem
                                title="Technique"
                                body={generation.options.technique?.join(", ") as ""}
                            />
                        )}
                    {generation.options.lighting &&
                        generation.options.lighting.length > 0 && (
                            <OptionItem
                                title="Lighting"
                                body={generation.options.lighting?.join(", ") as ""}
                            />
                        )}
                    {generation.options.resolution &&
                        generation.options.resolution.length > 0 && (
                            <OptionItem
                                title="Resolution"
                                body={generation.options.resolution?.join(", ") as ""}
                            />
                        )}
                    {generation.options.setting &&
                        generation.options.setting.length > 0 && (
                            <OptionItem
                                title="Setting"
                                body={generation.options.setting?.join(", ") as ""}
                            />
                        )}
                    {generation.options.angle && generation.options.angle.length > 0 && (
                        <OptionItem
                            title="Angle"
                            body={generation.options.angle?.join(", ") as ""}
                        />
                    )}
                </div>
                <div className="h-full flex items-end">
                    <Button
                        as={Link}
                        href={`/comparison/${generation.comparison_id}/${generation.id}`}
                    >
                        Edit
                    </Button>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <Link href={`/comparison/${generation.comparison_id}/${generation.id}`}>
                    Edit
                </Link>
            </div>
        );
    }
};

type CompareProps = Readonly<{
    comparison: Comparison;
}>;
export default function Compare({ comparison }: CompareProps) {
    const websocket = useContext(SocketContext);
    const path = usePathname();
    useEffect(() => {
        const onMessage = (event: any) => {
            console.log("EVENT: ", event);
            switch (JSON.parse(event.data).type) {
                case "generation_complete":
                    console.log("REVALIDATING");
                    update(path);
                    break;
            }
        };
        websocket?.current?.addEventListener("message", onMessage);
        return () => {
            websocket?.current?.removeEventListener("message", onMessage);
        };
    }, [websocket?.current]);
    return (
        <div className="relative @container h-full flex flex-col justify-center gap-[1rem] w-full max-w-[1200px]">
            <Link href="/comparison">
                <IoIosArrowRoundBack className="text-2xl" /> Back
            </Link>
            <h1 className="text-2xl font-normal">Compare</h1>
            <div className="flex gap-[1rem]">
                <div className="basis-[50%]">
                    {comparison.generation_a.generating ? (
                        <>
                            <Spinner className="m-auto w-full" />
                            <p className="text-center">Generating...</p>
                        </>
                    ) : (
                        <CompareGeneration
                            generation={comparison.generation_a}
                            other={comparison.generation_b}
                        />
                    )}
                </div>
                <div className="basis-[50%]">
                    {comparison.generation_b.generating ? (
                        <>
                            <Spinner className="m-auto w-full" />
                            <p className="text-center">Generating...</p>
                        </>
                    ) : (
                        <CompareGeneration
                            generation={comparison.generation_b}
                            other={comparison.generation_a}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
