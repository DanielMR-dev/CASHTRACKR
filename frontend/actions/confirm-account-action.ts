"use server"

import { ErrorResponseSchema, SuccessSchema, TokenSchema } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: {
        message: string;
    };
};

export async function confirmAccount(prevState: ActionStateType, token: string) {
    const confirmToken = TokenSchema.safeParse(token);
    if (!confirmToken.success){
        return {
            errors: confirmToken.error.issues.map((issue) => issue.message),
            success: { message: "" },
        };
    }
    // Confirm account
    const url = `${process.env.API_URL}/auth/confirm-account`;
    const request = await fetch(url, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token: confirmToken.data,
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