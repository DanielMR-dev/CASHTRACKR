"use server"

import { Budget, Expense } from "@/src/schemas";

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
    
}