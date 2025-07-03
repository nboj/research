"use client"

import configureAmplify from "@/configure-amplify";
import { HeroUIProvider } from "@heroui/system";
import { createContext, useState } from "react";

export const AuthContext = createContext<any>({});

configureAmplify()

type Props = Readonly<{
        children: React.ReactNode
}>
export default function Providers({ children }: Props) {
        const [authState, setAuthState] = useState();
        return (
                <HeroUIProvider className="h-full">
                        <AuthContext.Provider value={{ authState, setAuthState }}>
                                {children}
                        </AuthContext.Provider>
                </HeroUIProvider>
        )
}
