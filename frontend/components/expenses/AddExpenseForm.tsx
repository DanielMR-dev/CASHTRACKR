import { DialogTitle } from "@headlessui/react";
import ExpenseForm from "./ExpenseForm";
import createExpense from "@/actions/create-expense-action";
import { useActionState } from "react";
import { useParams } from "next/navigation";
import ErrorMessage from "../ui/ErrorMessage";

export default function AddExpenseForm() {
    const { id } = useParams<{ id: string }>();
    const budgetId = Number(id); // o +id
    const createExpenseWithBudgetId = createExpense.bind(null, budgetId);
    const [state, formAction] = useActionState(createExpenseWithBudgetId, {
        errors: [],
        success: { message: "" }
    });

    return (
        <>
            <DialogTitle
                as="h3"
                className="font-black text-4xl text-purple-950 my-5"
            >
                Agregar Gasto
            </DialogTitle>

            <p className="text-xl font-bold">Llena el formulario y crea un {''}
                <span className="text-amber-500">gasto</span>
            </p>
            {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)}
            <form
                className="bg-gray-100 shadow-lg rounded-lg p-10 mt-5 border border-gray-300"
                noValidate
                action={formAction}
            > 
                <ExpenseForm />

                <input
                    type="submit"
                    className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
                    value='Registrar Gasto'
                />
            </form>
        </>
    )
}