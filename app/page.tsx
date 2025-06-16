'use client'
import { signIn, signOut } from "aws-amplify/auth";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useCallback } from "react";
import { logout } from "./actions";

export default function Home() {
  const router = useRouter();
  const test = useCallback(async () => {
    const _ = await logout();
    const res = await signOut();
    console.log(res);
    router.push("/auth/login");
  }, [])
  return (
    <div>
      <button onClick={test}>Logout</button>
    </div>
  );
}
