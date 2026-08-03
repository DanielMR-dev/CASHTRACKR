"use server"

import { ForgotPasswordSchema } from "@/src/schemas";

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

    console.log(forgotPassword);
    return {
        errors: [],
        success: {
            message: ""
        }
    }
}