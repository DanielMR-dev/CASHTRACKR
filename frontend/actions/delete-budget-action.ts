"use server"

import { getToken } from "@/src/auth/token";
import { Budget, ErrorResponseSchema, PasswordValidationSchema } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: {
        message: string;
    };
};

export async function deleteBudget(budgetId: Budget["id"], prevState: ActionStateType, formData: FormData) {
    const currentPassword = PasswordValidationSchema.safeParse(formData.get("password"));
    if (!currentPassword.success) {
        return {
            errors: currentPassword.error.issues.map(issue => issue.message),
            success: { message: "", },
        };
    }
    // Check Password
    const token = await getToken();
    const checkPasswordUrl = `${process.env.API_URL}/auth/check-password`;
    const checkPasswordRequest = await fetch(checkPasswordUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            password: currentPassword.data
        })
    });
    const checkPasswordData = await checkPasswordRequest.json();
    if (!checkPasswordRequest.ok) {
        const { error } = ErrorResponseSchema.parse(checkPasswordData);
        return {
            errors: [error],
            success: { message: "" },
        };
    }

    return {
        errors: [],
        success: {
            message: "",
        },
    };
}