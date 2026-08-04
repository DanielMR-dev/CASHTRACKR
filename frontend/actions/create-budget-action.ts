"use server"

import { DraftBudgetSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas";
import { cookies } from "next/headers";

type ActionStateType = {
    errors: string[];
    success: {
        message: string;
    };
};

export async function createBudget(prevState: ActionStateType, formData: FormData) {

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
    const cookieStore = await cookies();
    const token = cookieStore.get("CASHTRACKR_TOKEN")?.value;
    const url = `${process.env.API_URL}/budgets`;
    const request = await fetch(url, {
        method: "POST",
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
    if (request.status !== 201) {
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