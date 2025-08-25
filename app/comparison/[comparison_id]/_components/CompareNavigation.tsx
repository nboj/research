"use client"

import { Tab, Tabs } from "@heroui/react"
import { usePathname, useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";

interface CompareNavigationProps {
    generation_a: string;
    generation_b: string;
    comparison_id: string;
}
export default function CompareNavigation({ comparison_id, generation_a, generation_b }: CompareNavigationProps) {
    const [key, setKey] = useState<any>("");
    const pathname = usePathname();
    const router = useRouter();
    useEffect(() => {
        if (!key) {
            setKey(pathname.replace("/comparison/", ""));
        } else if (key != pathname) {
            router.push(`/comparison/${key}`);
        }
    }, [pathname, key]);
    return (
        <Tabs onSelectionChange={setKey} selectedKey={key} className="m-auto">
            <Tab title="Generation A" key={`${comparison_id}/${generation_a}`}></Tab>
            <Tab title="Generation B" key={`${comparison_id}/${generation_b}`}></Tab>
            <Tab title="Compare" key={comparison_id}></Tab>
        </Tabs>

    )
}
