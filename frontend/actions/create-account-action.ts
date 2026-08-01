"use server"

import { ErrorResponseSchema, RegisterSchema, SuccessSchema } from "@/src/schemas";
type ActionStateType = {
    errors: string[];
    success: {
        message: string;
    };
    email?: string;
    name?: string;
};


export async function register(prevState: ActionStateType, formData: FormData) {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    const registerData = {
        email,
        name,
        password: formData.get("password"),
        password_confirmation: formData.get("password_confirmation"),
    }
    // Validate
    const registerValidation = RegisterSchema.safeParse(registerData);
    if (!registerValidation.success) {
        const errors = registerValidation.error.issues.map(error => error.message);
        return { 
            errors,
            success: { message: '' },
            email,
            name
        };
    }
    // Register user
    const url = `${process.env.API_URL}/auth/create-account`;
    const request = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: registerValidation.data.name,
            email: registerValidation.data.email,
            password: registerValidation.data.password
        }),
    });
    const data = await request.json();
    if (request.status !== 201) {
        const { error } = ErrorResponseSchema.parse(data);
        return {
            errors: [error],
            success: { message: '' },
            email,
            name
        }
    }
    const success = SuccessSchema.parse(data);
    return {
        success,
        errors: []
    }
}