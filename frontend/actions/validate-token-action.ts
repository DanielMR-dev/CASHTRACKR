"use server"

import { ErrorResponseSchema, SuccessSchema, TokenSchema } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: {
        message: string;
    };
};

export async function validateToken(token: string, prevState: ActionStateType) {
    const resetPasswordToken = TokenSchema.safeParse(token);
    if (!resetPasswordToken.success){
        return {
            errors: resetPasswordToken.error.issues.map((issue) => issue.message),
            success: { message: "" },
        };
    }
    const url = `${process.env.API_URL}/auth/validate-token`;
    const request = await fetch(url, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token: resetPasswordToken.data,
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