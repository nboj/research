// app/providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { createContext, RefObject, useEffect, useRef } from "react";
import { configureAmplifyClient } from "./_utils/amplifyClient";

declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NonNullable<
            Parameters<ReturnType<typeof useRouter>["push"]>[1]
        >;
    }
}

export const SocketContext = createContext<RefObject<WebSocket | null> | null>(
    null,
);

export default function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const websocket = useRef<WebSocket>(null);

    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const reconnectAttempts = useRef(0);
    const manualClose = useRef(false); // set true during unmount to avoid reconnection
    const alertedOnce = useRef(false); // avoid spamming alerts

    // util: clear timers
    const clearTimers = () => {
        if (reconnectTimer.current) {
            clearTimeout(reconnectTimer.current);
            reconnectTimer.current = null;
        }
    };

    const scheduleReconnect = () => {
        if (manualClose.current) return; // don't reconnect if we're unmounting
        // Exponential backoff with jitter, capped at 30s
        const attempt = reconnectAttempts.current++;
        const base = Math.min(30_000, 1_000 * 2 ** attempt);
        const jitter = Math.floor(Math.random() * 500);
        const delay = base + jitter;

        reconnectTimer.current = setTimeout(() => {
            connect();
        }, delay);
    };
    const connect = () => {
        // If an old socket still exists, close it first
        if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
            return; // already connected
        }
        // Pick your URL (you can make this env-driven if you like)
        const url = `https://api.research.cauman.com/ws-connect`;
        //const url = `http://localhost:8000/ws-connect`;

        try {
            const socket = new WebSocket(url);

            socket.addEventListener("open", () => {
                console.log("OPENED SOCKET");
                websocket.current = socket;
                reconnectAttempts.current = 0;
                alertedOnce.current = false; // reset alert state after a good reconnect
            });

            //socket.addEventListener("message", (evt) => {
            //    // Optional: handle pongs if your server replies
            //    // const data = JSON.parse(evt.data);
            //    // if (data?.type === 'pong') { /* ... */ }
            //});

            const handleCloseOrError = (kind: "close" | "error") => () => {
                clearTimers();
                // only show the alert once per disconnect storm
                if (!manualClose.current && !alertedOnce.current) {
                    alert("Connection to websocket closed! Reconnecting automatically…");
                    alertedOnce.current = true;
                }
                if (kind === "error") {
                    // Force-close to ensure the 'close' path runs consistently
                    try {
                        socket.close();
                    } catch {
                        /* ignore */
                    }
                }
                scheduleReconnect();
            };

            socket.addEventListener("close", handleCloseOrError("close"));
            socket.addEventListener("error", handleCloseOrError("error"));
        } catch (e) {
            // If constructor throws, schedule a reconnect too
            scheduleReconnect();
        }
    };
    useEffect(() => {
        manualClose.current = false;
        connect();

        // Optional: reconnect when the app comes back online
        const onOnline = () => {
            if (websocket.current?.readyState !== WebSocket.OPEN) {
                scheduleReconnect();
            }
        };
        window.addEventListener("online", onOnline);

        configureAmplifyClient();

        return () => {
            manualClose.current = true;
            clearTimers();
            window.removeEventListener("online", onOnline);
            try {
                websocket.current?.close();
            } catch {
                /* ignore */
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //useEffect(() => {
    //    const socket = new WebSocket(`https://api.research.cauman.com/ws-connect`);
    //    //const socket = new WebSocket(`http://localhost:8000/ws-connect`);
    //    const onOpen = (_event: Event) => {
    //        console.log("OPENED SOCKET");
    //        websocket.current = socket;
    //    };
    //    const onClose = (_event: Event) => {
    //        alert(
    //            "Connection to websocket closet! Please refresh the page to reconnect.",
    //        );
    //    };
    //    socket.addEventListener("open", onOpen);
    //    socket.addEventListener("close", onClose);
    //    return () => {
    //        socket.removeEventListener("open", onOpen);
    //        socket.removeEventListener("close", onClose);
    //    };
    //}, []);
    return (
        <HeroUIProvider navigate={router.push} className="h-full">
            <SocketContext.Provider value={websocket}>
                {children}
            </SocketContext.Provider>
        </HeroUIProvider>
    );
}
