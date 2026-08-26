import { Metadata } from "next";
import { getBudget } from "@/src/services/budgets";
import AddExpenseButton from "@/components/expenses/AddExpenseButton";
import ModalContainer from "@/components/ui/ModalContainer";
import { formatCurrency, formatDate } from "@/src/utils";
import ExpenseMenu from "@/components/expenses/ExpenseMenu";
import Amount from "@/components/ui/Amount";
import ProgressBar from "@/components/budgets/ProgressBar";

export async function generateMetada({params}: {params: Promise<{id: string}>}) : Promise<Metadata> {
    const { id } = await params;
    const budget = await getBudget(id);
    return {
        title: `CashTrackr - ${budget.name}`,
        description: `Edita el presupuesto ${budget.name}`,
    };
}

export default async function BudgetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const budget = await getBudget(id);

    const totalSpend = budget.expenses.reduce((total, expense) => total + +expense.amount, 0);
    const availableAmount = +budget.amount - totalSpend;
    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-black text-4xl text-purple-950">{budget.name}</h1>
                    <p className="text-xl font-bold">Administra tus {''} <span className="text-amber-500">gastos</span></p>
                </div>
                <AddExpenseButton />
            </div>

            {budget.expenses.length ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
                        <ProgressBar />
                        <div className="flex flex-col justify-center items-center md:items-start gap-5">
                            <Amount
                                label="Presupuesto"
                                amount={+budget.amount}
                            />
                            <Amount
                                label="Disponible"
                                amount={availableAmount}
                            />
                            <Amount
                                label="Gastado"
                                amount={totalSpend}
                            />
                        </div>
                    </div>
                    <h1 className="font-black text-4xl text-purple-950 mt-5">
                        Gastos en este presupuesto
                    </h1>
                    <ul role="list" className="divide-y divide-gray-300 border border-gray-300 shadow-lg mt-10 rounded-lg">
                        {budget.expenses.map((expense) => (
                            <li key={expense.id} className="flex justify-between gap-x-6 p-5">
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="min-w-0 flex-auto space-y-2">
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {expense.name}
                                        </p>
                                        <p className="text-xl font-bold text-amber-500">
                                            {formatCurrency(+expense.amount)}
                                        </p>
                                        <p className='text-gray-500  text-sm'>
                                            Agregado: {""}
                                            <span className="font-bold">{formatDate(expense.createdAt)}</span>
                                        </p>
                                    </div>
                                </div>
                                <ExpenseMenu 
                                    expenseId={expense.id}
                                />
                            </li>
                        ))}
                        </ul>
                </>
            ) : (
                <p className="text-center py-10">No hay gastos aún</p>
            )}
            <ModalContainer />
        </>
    );
}
