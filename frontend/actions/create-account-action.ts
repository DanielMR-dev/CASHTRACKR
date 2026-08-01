"use server"

import { RegisterSchema } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
};

export async function register(prevState: ActionStateType, formData: FormData) {
    const registerData = {
        email: formData.get("email"),
        name: formData.get("name"),
        password: formData.get("password"),
        password_confirmation: formData.get("password_confirmation"),
    }
    // Validate
    const registerValidation = RegisterSchema.safeParse(registerData);
    if (!registerValidation.success) {
        const errors = registerValidation.error.issues.map(error => error.message);
        return { errors };
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
    console.log(data);
    return {
        errors: []
    }
}