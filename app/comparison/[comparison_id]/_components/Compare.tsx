'use client'

import { Comparison } from "../../../types";

type CompareProps = Readonly<{
    comparison: Comparison;
}>
export default function Compare({ comparison }: CompareProps) {

    return (
        <div className="relative @container h-full flex flex-col justify-center gap-[1rem] w-full max-w-[800px]">
            <h1 className="text-xl font-light">Compare</h1>
            <div className="flex content-center items-center gap-[1rem]">
                <h1>Seed: {comparison.seed}</h1>
            </div>
        </div >
    );
}
