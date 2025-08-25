'use client'

import { Button } from "@heroui/react"
import { useCallback } from "react"
import { createComparison } from "../actions/comparison";
import { useRouter } from "next/navigation";

export default function CreateComparison() {
    const router = useRouter();
    const handleAction = useCallback(async () => {
        const [comparison_id, generation_id] = await createComparison();
        if (generation_id && comparison_id) {
            router.push(`comparison/${comparison_id}`);
        }
    }, []);
    return (
        <Button onPress={handleAction}>New +</Button>
    )
}
