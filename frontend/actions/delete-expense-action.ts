"use server"

import { getToken } from "@/src/auth/token";
import { Budget, ErrorResponseSchema, Expense, SuccessSchema } from "@/src/schemas";
import { revalidatePath } from "next/cache";

type BudgetAndExpenseIdType = {
    budgetId: Budget['id'];
    expenseId: Expense['id'];
}

type ActionStateType = {
    errors: string[];
    success: {
        message: string;
    };
};

export async function deleteExpense(
    { budgetId, expenseId }: BudgetAndExpenseIdType, 
    prevState: ActionStateType
) {
    const token = await getToken();
    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`;
    const request = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await request.json();
    if (!request.ok) {
        const { error } = ErrorResponseSchema.parse(data);
        return {
            errors: [error],
            success: { message: "" }
        }
    }
    const success = SuccessSchema.parse(data);
    revalidatePath(`/admin/budgets/${budgetId}`);
    return {
        errors: [],
        success: success
    }
}