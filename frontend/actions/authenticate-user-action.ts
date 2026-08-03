"use server";

import { ErrorResponseSchema, LoginSchema, SuccessSchema } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    
}

export async function authenticate(prevState: ActionStateType, formData: FormData) {
    const loginCredentials = {
        email: formData.get("email"),
        password: formData.get("password")
    }
    const auth = LoginSchema.safeParse(loginCredentials);
    if (!auth.success) {
        return {
            errors: auth.error.issues.map((issue) => issue.message),
            success: {
                message: ""
            }
        }
    }
    // Login User
    const url = `${process.env.API_URL}/auth/login`;
    const request = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            password: auth.data.password,
            email: auth.data.email
        })
    });
    const data = await request.json();
    
    return {
        errors: [],
    }
}
