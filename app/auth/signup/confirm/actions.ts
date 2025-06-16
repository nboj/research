'use server'

import { confirmSignUp, signUp, getCurrentUser } from "aws-amplify/auth";
import { redirect } from "next/navigation"

export const signup = async (initialState: any, formData: FormData) => {
	console.log(formData.entries())
        const raw = {
                email: formData.get("email"),
                code: formData.get("code"),
        }
        console.log(raw);
	if (!raw.code) {
		return {message: "failed code"};
	}
	if (!raw.email) {
		return {message: "failed email"};
	}
	let confirm = await confirmSignUp({
		username: raw.email.toString(),
		confirmationCode: raw.code.toString()
	});
	console.log(confirm);
	redirect("/auth/login");
}
