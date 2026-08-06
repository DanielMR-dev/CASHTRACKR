"use client"
import { useActionState } from "react";
import { Budget } from "@/src/schemas";
import BudgetForm from "./BudgetForm";
import { editBudget } from "@/actions/edit-budget-action";

export default function EditBudgetForm({budget}: {budget: Budget}) {

    const editBudgetWithId = editBudget.bind(null, budget.id);
    const [state, formAction] = useActionState(editBudgetWithId, {
        errors: [],
        success: { message: "" }
    });

    return (
        <form
            className="mt-5 space-y-3"
            noValidate
            action={formAction}
        >
            <BudgetForm
                budget={budget}
            />
            <input
                type="submit"
                className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
                value="Guardar Cambios"
            />
        </form>
    )
}
