'use client'

import Form from "next/form"
import {signup} from './actions'
import { useActionState, useContext, useEffect, useState } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AuthContext } from "../../Providers"

const initialState = {
	message: '',
	success: false,
	email: ""
}
export default function Signup() {
	const [state, signupAction, pending] = useActionState(signup, initialState);
	const {setAuthState} = useContext(AuthContext);
	useEffect(() => {
		if (state.success) {
			setAuthState(state.email);
			redirect('/auth/signup/confirm');
		}
	}, [state])
	return (
		<Form action={signupAction}>
			<input type='email' name='email' />
			<input type='password' name='password' />
			<p>{state.message}</p>
			<Link href='/auth/login'>Login</Link>
			<button type="submit">Signup</button>
		</Form>
	)
}

