"use server"

import { RegisterSchema, SuccessSchema } from "@/src/schemas";
type ActionStateType = {
    errors: string[];
    success: {
        message: string;
    };
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
        return { 
            errors,
            success: prevState.success
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
    const success = SuccessSchema.parse(data);
    console.log(success);
    return {
        success,
        errors: prevState.errors
    }
}