import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import configureAmplify from "@/configure-amplify";
import Image from "next/image";
import generator_icon from '@/public/generator_icon.png';

import { comparisons } from "./types";
import Link from "next/link";

configureAmplify()

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Research",
    description: "Research site",
};



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased light text-foreground bg-background`}
            >
                <Providers>
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
                </Providers>
            </body>
        </html >
    );
}
