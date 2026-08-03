"use server"

import { ErrorResponseSchema, ForgotPasswordSchema, SuccessSchema } from "@/src/schemas";

type ActionsStateType = {
    errors: string[];
    success: { 
        message: string
    };
}

export async function forgotPassword(prevState: ActionsStateType, formData: FormData) {
    const forgotPassword = ForgotPasswordSchema.safeParse({
        email: formData.get("email")
    });
    if (!forgotPassword.success) {
        return {
            errors: forgotPassword.error.issues.map((issue) => issue.message),
            success: { message: "" },
        };
    }
    const url = `${process.env.API_URL}/auth/forgot-password`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: forgotPassword.data.email
        }),
    });
    const data = await response.json();
    if(response.status !== 200) {
        const { error } = ErrorResponseSchema.parse(data);
        return {
            errors: [error],
            success: { message: "" },
        }
    }
    const success = SuccessSchema.parse(data);
    return {
        errors: [],
        success
    }
}