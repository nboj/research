'use client'

import Form from "next/form"
import { useActionState } from "react"
import Link from "next/link"
import { AuthError, fetchAuthSession, getCurrentUser, signIn } from "aws-amplify/auth"
import { redirect } from "next/navigation"
import { login } from "./actions"


const login_client = async (initialState: any, formData: FormData) => {
        console.log(formData.entries())
        const raw = {
                email: formData.get("email"),
                password: formData.get("password"),
        }
        if (!raw.email) {
                return { message: "failed email" };
        }
        if (!raw.password) {
                return { message: "failed password" };
        }
        let res = await signIn({
                username: raw.email?.toString(),
                password: raw.password?.toString(),
        });
        console.log(res);
        if (res.isSignedIn) {
                const session = await fetchAuthSession();
                if (session.tokens?.idToken) {
                        await login(session.tokens?.idToken?.toString());
                }
        } else {
                return { message: res.nextStep.signInStep }
        }
        return {message: "failure."}

}

const initialState = {
        message: ''
}
export default function Login() {
        const [state, loginAction, pending] = useActionState(login_client, initialState);
        return (
                <Form action={loginAction}>
                        <input type='email' name='email' />
                        <input type='password' name='password' />
                        <p>{state.message}</p>
                        <Link href='/auth/signup'>Signup</Link>
                        <button disabled={pending} type="submit">Login</button>
                </Form>
        )
}

