"use server"

import { Budget } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: {
        message: string;
    };
};

export async function deleteBudget(budgetId: Budget["id"], prevState: ActionStateType, formData: FormData) {

    return {
        errors: [],
        success: {
            message: "",
        },
    };
}