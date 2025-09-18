'use client'

import { Button } from "@heroui/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const [ready, setReady] = useState<boolean>(false);
    const socket = useRef<WebSocket>(null);
    useEffect(() => {
        socket.current = new WebSocket("http://localhost:8000/ws-connect");
        socket.current.addEventListener("message", (ev) => {
            console.log(ev.data)
        })
        socket.current.addEventListener("open", (_ev) => {
            setReady(true);
        })
    }, [])
    const handlePress = () => {
        if (socket.current && ready) {
            socket.current.send("test");
        }
    }
    return (
        <div className="flex flex-col">
            <Link href="/comparison">Comparisons</Link>
            <Link href="/api/auth/sign-out">Sign Out</Link>
            <Button onPress={handlePress}>test</Button>
        </div>
    );
}
