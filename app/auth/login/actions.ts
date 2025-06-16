'use server'

import { verifyToken } from "@/app/_lib/jwt";
import configureAmplify from "@/configure-amplify";
import { AuthSession, fetchAuthSession, signIn } from "aws-amplify/auth";
import { getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const login = async (sessionId: string) => {
        if (sessionId) {
                const v = await verifyToken(sessionId);
                console.log(v);
                (await cookies()).set('idToken', sessionId);
                redirect('/');
        }
}
