'use client'
import { signIn } from "aws-amplify/auth";
import Image from "next/image";

export default function Home() {
  const test = async () => {
    const res = await signIn({
      username: "bob",
      password: "builder"
    });
    console.log(res);
  }
  return (
    <div>
      <button onClick={test}>test</button>
    </div>
  );
}
