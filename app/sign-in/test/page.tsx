"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input } from "@heroui/react";
import { signIn, confirmSignIn } from "aws-amplify/auth";

export default function Login() {
  const [username, setUsername] = useState(""); // email or phone (E.164)
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"enterId" | "enterCode">("enterId");
  const [error, setError] = useState<string | null>(null);

  async function startEmailOtp() {
    setError(null);
    try {
      const { nextStep } = await signIn({
        username,
        options: { authFlowType: "USER_AUTH", preferredChallenge: "EMAIL_OTP" },
      });
      if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_EMAIL_CODE") {
        setStep("enterCode");
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to start sign-in");
    }
  }

  async function confirmEmailOtp() {
    setError(null);
    try {
      const { nextStep } = await confirmSignIn({ challengeResponse: code });
      if (nextStep.signInStep === "DONE") {
        // e.g. refresh or push("/")
        window.location.href = "/";
      }
    } catch (e: any) {
      setError(e?.message ?? "Invalid code");
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Welcome!</h1>
      <p>Please sign in to use Prompt Studio.</p>

      {/* Hosted UI / federated (what you already have) */}
      <div className="space-x-2">
        <Button as={Link} href="/api/auth/sign-in">Sign In (Hosted UI)</Button>
        <Button as={Link} href="/api/auth/sign-up">Sign Up</Button>
      </div>

      <div className="h-px bg-gray-200 my-2" />

      {/* Passwordless via Email OTP */}
      {step === "enterId" && (
        <div className="space-y-2">
          <Input
            label="Email"
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button onPress={startEmailOtp}>Sign in with email code</Button>
        </div>
      )}

      {step === "enterCode" && (
        <div className="space-y-2">
          <Input
            label="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button onPress={confirmEmailOtp}>Confirm code</Button>
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
