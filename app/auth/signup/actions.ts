'use server'

import { confirmSignUp, resendSignUpCode, signUp } from "aws-amplify/auth";
import { redirect } from "next/navigation"

export const signup = async (initialState: any, formData: FormData) => {
	console.log(formData.entries())
        const raw = {
                email: formData.get("email"),
                password: formData.get("password"),
        }
        console.log(raw);
	if (!raw.email) {
		return {message: "failed email"};
	}
	if (!raw.password) {
		return {message: "failed password"};
	}
	await signUp({
		username: raw.email?.toString(),
		password: raw.password?.toString(),
	});
	return {
		success: true,
		message: "",
		email: raw.email,
	}
}
