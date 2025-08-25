'use client'

import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col">
            <Link href="/comparison">Comparisons</Link>
            <Link href="/api/auth/sign-out">Sign Out</Link>
        </div>
    );
}
