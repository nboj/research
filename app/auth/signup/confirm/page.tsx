'use client'

import Form from "next/form"
import {signup} from './actions'
import { useActionState, useContext } from "react"
import Link from "next/link"
import { AuthContext } from "@/app/Providers"

const initialState = {
	message: ''
}
export default function ConfirmSignup() {
	const [state, signupAction, pending] = useActionState(signup, initialState);
	const {authState} = useContext(AuthContext);
	return (
		<Form action={signupAction}>
			<input type='email' name='email' defaultValue={authState} />
			<input type='number' name='code' />
			<p>{state.message}</p>
			<Link href='/auth/signup'>Signup</Link>
			<button type="submit">Signup</button>
		</Form>
	)
}

