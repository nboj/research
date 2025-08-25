'use client'

import { Button } from "@heroui/react"
import { useCallback } from "react"
import { deleteAllComparisons } from "../actions/comparison";

export default function DeleteComparison() {
    const handleAction = useCallback(async () => {
        const res = await deleteAllComparisons();
        console.log(res);
    }, []);
    return (
        <Button onPress={handleAction}>Delete All</Button>
    )
}
