"use server"

import { TokenSchema } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
};

export async function confirmAccount(token: string, prevState: ActionStateType) {
    const confirmToken = TokenSchema.safeParse(token);
    if(!confirmToken.success){
        return {
            errors: confirmToken.error.issues.map((issue) => issue.message),
            success: ''
        };
    }
    return {
        errors: [],
    }
}