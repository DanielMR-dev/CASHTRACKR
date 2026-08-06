"use server"

import { Budget, DraftBudgetSchema } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: {
        message: string;
    };
}

export async function editBudget(budgetId: Budget["id"], prevState: ActionStateType, formData: FormData) {

    const budget = DraftBudgetSchema.safeParse({
            name: formData.get("name"),
            amount: formData.get("amount")
        });
        if (!budget.success) {
            return {
                errors: budget.error.issues.map(issue => issue.message),
                success: { message: "" }
            }
        }

    return {
        errors: [],
        success: { message: "" }
    }
}