"use client"

import { HeroUIProvider } from "@heroui/system";


type Props = Readonly<{
    children: React.ReactNode
}>
export default function Providers({ children }: Props) {
    return (
        <HeroUIProvider className="h-full">
            {children}
        </HeroUIProvider>
    )
}
