"use client"

import { useActionState, useEffect } from "react"
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createBudget } from "@/actions/create-budget-action"
import ErrorMessage from "../ui/ErrorMessage";
import BudgetForm from "./BudgetForm";

export default function CreateBudgetForm() {

    const router = useRouter();
    const [state, formAction] = useActionState(createBudget, {
        errors: [],
        success: {
            message: ""
        }
    });

    useEffect(() => {
        if (state.success.message) {
            toast.success(state.success.message);
            router.push("/admin");
        }
    }, [state, router]);

    return (
        <form
            className="mt-5 space-y-3"
            noValidate
            action={formAction}
        >
            {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)}
            <BudgetForm />
            <input
                type="submit"
                className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
                value="Crear Presupuesto"
            />
        </form>
    )
}