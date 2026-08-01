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
    console.log(errors);
    // Register user
}