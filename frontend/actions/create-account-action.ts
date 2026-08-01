"use server"

import { RegisterSchema } from "@/src/schemas";

export async function register(formData: FormData) {
    const registerData = {
        email: formData.get("email"),
        name: formData.get("name"),
        password: formData.get("password"),
        password_confirmation: formData.get("password_confirmation"),
    }
    // Validate
    const registerValidation = RegisterSchema.safeParse(registerData);
    const errors = registerValidation.error?.issues.map(error => error.message);
    if (!registerValidation.success) {
        return {  };
    }
    console.log(errors);
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
}