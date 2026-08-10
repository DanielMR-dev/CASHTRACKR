"use server"

import { getToken } from "@/src/auth/token";
import { DraftExpenseSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: {
        message: string;
    };
};

export default async function createExpense(budgetId: number, prevState: ActionStateType, formData: FormData) {
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
    // Generate Expense
    const token = await getToken();
    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses`;
    const request = await fetch(url, {
        method: "POST",
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
    return {
        errors: [],
        success: success
    }
}