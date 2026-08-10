"use server"

type ActionStateType = {
    errors: string[];
    success: {
        message: string;
    };
};

export default async function createExpense(budgetId: number, prevState: ActionStateType, formData: FormData) {
    return {
        errors: [],
        success: { message: "" }
    }
}