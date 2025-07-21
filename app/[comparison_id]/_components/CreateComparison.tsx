'use client'

import { Button } from "@heroui/react"
import { useCallback } from "react"
import { createComparison } from "../actions/comparison";

export default function CreateComparison() {
    const handleAction = useCallback(async () => {
        const res = await createComparison();
        console.log(res);
    }, []);
    return (
        <Button onPress={handleAction}>New +</Button>
    )
}
