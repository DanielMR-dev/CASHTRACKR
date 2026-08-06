"use server"

import { getToken } from "@/src/auth/token";
import { Budget, DraftBudgetSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas";
import { revalidatePath } from "next/cache";

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
    const token = await getToken();
    const url = `${process.env.API_URL}/budgets/${budgetId}`;
    const request = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name: budget.data.name,
            amount: budget.data.amount
        })
    });
    const data = await request.json();
    if (!request.ok) {
        const { error } = ErrorResponseSchema.parse(data);
        return {
            errors: [error],
            success: { message: "" }
        }
    }
    revalidatePath("/admin");
    const success = SuccessSchema.parse(data);
    return {
        errors: [],
        success: success
    }
}