// app/providers.tsx
'use client'

import { HeroUIProvider } from '@heroui/react'
import { useRouter } from 'next/navigation';
import { createContext, MutableRefObject, RefObject, useEffect, useRef } from 'react';

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

export const SocketContext = createContext<RefObject<WebSocket|null>|null>(null);

export default function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const websocket = useRef<WebSocket>(null);
    useEffect(() => {
        const socket = new WebSocket(`https://api.research.cauman.com/ws-connect`);
        const onOpen = (_event: Event) => {
            console.log("OPENED SOCKET");
            websocket.current = socket;
        };
        socket.addEventListener("open", onOpen);
        return () => {
            socket.removeEventListener("open", onOpen);
        }
    }, [])
    return (
        <HeroUIProvider navigate={router.push} className='h-full'>
            <SocketContext.Provider value={websocket}>
            {children}
            </SocketContext.Provider>
        </HeroUIProvider>
    )
}
