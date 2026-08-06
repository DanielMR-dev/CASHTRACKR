"use client"
import BudgetForm from "./BudgetForm";

export default function EditBudgetForm() {
    return (
        <form
            className="mt-5 space-y-3"
            noValidate
            action={() => {}}
        >
            <BudgetForm />
            <input
                type="submit"
                className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
                value="Guardar Cambios"
            />
        </form>
    )
}
