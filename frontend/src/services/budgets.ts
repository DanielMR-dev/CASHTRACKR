import { cache } from "react";
import { notFound } from "next/navigation";
import { getToken } from "@/src/auth/token";
import { BudgetAPIResponseSchema } from "@/src/schemas";

export const getBudget = cache(async (budgetId: string) => {
    const token = await getToken();
    const url = `${process.env.API_URL}/budgets/${budgetId}`;
    const request = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await request.json();
    if (!request.ok) {
        notFound();
    }
    const budget = BudgetAPIResponseSchema.parse(data);
    return budget;
});