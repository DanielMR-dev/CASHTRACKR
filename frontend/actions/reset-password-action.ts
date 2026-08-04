"use server"

import { ErrorResponseSchema, ResetPasswordSchema, SuccessSchema } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: {
        message: string;
    };
};

export async function resetPassword(token: string, prevState: ActionStateType, formData: FormData) {
    const resetPasswordInput = {
        password: formData.get("password"),
        password_confirmation: formData.get("password_confirmation"),
    };

    const resetPassword = ResetPasswordSchema.safeParse(resetPasswordInput);
    if (!resetPassword.success){
        return {
            errors: resetPassword.error.issues.map((issue) => issue.message),
            success: { message: "" },
        };
    }

    const url = `${process.env.API_URL}/auth/reset-password/${token}`;
    const request = await fetch(url, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            password: resetPassword.data.password,
        }),
    });
    const data = await request.json();
    if (request.status !== 200) {
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