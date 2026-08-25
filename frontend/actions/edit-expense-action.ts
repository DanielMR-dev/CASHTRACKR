"use server"

import { getToken } from "@/src/auth/token";
import { Budget, DraftExpenseSchema, ErrorResponseSchema, Expense, SuccessSchema } from "@/src/schemas";
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

export default async function editExpense(
    { budgetId, expenseId }: BudgetAndExpenseIdType,
    prevState: ActionStateType,
    formData: FormData
) {
    const expenseData = {
        name: formData.get("name"),
        amount: formData.get("amount"),
    };
    const expense = DraftExpenseSchema.safeParse(expenseData);
    if (!expense.success) {
        return {
            errors: expense.error.issues.map(issue => issue.message),
            success: { message: "" }
        }
    }
    // Update expense
    const token = await getToken();
    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`;
    const request = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name: expense.data.name,
            amount: expense.data.amount
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
    const success = SuccessSchema.parse(data);
    revalidatePath(`/admin/budgets/${budgetId}`);
    return {
        errors: [],
        success: success
    }
}