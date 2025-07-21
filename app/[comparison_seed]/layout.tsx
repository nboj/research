import Image from "next/image";
import generator_icon from '@/public/generator_icon.png';

import { comparisons } from "../types";
import Link from "next/link";

interface LayoutProps {
    children: React.ReactNode
}
export default function layout({ children }: LayoutProps) {
    return (
        <div className="flex w-full justify-center gap-[2rem] m-auto">
            {children}
            <div className="flex flex-col">
                {
                    comparisons.map((comparison, index) => {
                        return (
                            <Link href={`/${comparison.seed}`} className="w-[10rem] flex" key={`${comparison.seed}-${index}`} >
                                <Image src={comparison?.generation_a?.output ?? generator_icon} alt={"Generated image."} className='object-contain h-full rounded-md' />
                                <Image src={comparison?.generation_b?.output ?? generator_icon} alt={"Generated image."} className='object-contain h-full rounded-md' />
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}
