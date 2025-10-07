// app/providers.tsx
'use client'

import { HeroUIProvider } from '@heroui/react'
import { useRouter } from 'next/navigation';
import { createContext, RefObject, useEffect, useRef } from 'react';

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
        //const socket = new WebSocket(`http://localhost:8000/ws-connect`);
        const onOpen = (_event: Event) => {
            console.log("OPENED SOCKET");
            websocket.current = socket;
        };
        const onError = (_event: Event) => {
            alert("Error occured connecting to the websocket. Please refresh the page.")
        }
        const onClose = (_event: Event) => {
            alert("Connection to websocket closet! Please refresh the page to reconnect.")
        }
        socket.addEventListener("open", onOpen);
        socket.addEventListener("error", onError);
        socket.addEventListener("close", onClose);
        return () => {
            socket.removeEventListener("open", onOpen);
            socket.removeEventListener("error", onError);
            socket.removeEventListener("close", onClose);
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
