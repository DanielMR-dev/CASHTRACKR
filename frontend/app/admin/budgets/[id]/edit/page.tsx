import { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditBudgetForm from "@/components/budgets/EditBudgetForm";
import { getToken } from "@/src/auth/token";
import { BudgetAPIResponseSchema } from "@/src/schemas";

const getBudget = cache(async (budgetId: string) => {
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

export async function generateMetada({params}: {params: {id: string}}) : Promise<Metadata> {
    const { id } = params;
    const budget = await getBudget(id);
    return {
        title: `CashTrackr - ${budget.name}`,
        description: `Edita el presupuesto ${budget.name}`,
    };
}

export default async function EditBudgetPage({ params }: {params: {id: string}}) {
    const { id } = params;
    const budget = await getBudget(id);
    return (
            <>
                <div className="flex flex-col-reverse md:flex-row md:justify-between items-center">
                    <div className="w-full md:w-auto">
                        <h1 className="font-black text-4xl text-purple-950 my-5">
                            Editar Presupuesto: {budget.name}
                        </h1>
                        <p className="text-xl font-bold">Llena el formulario y crea un nuevo {''}
                            <span className="text-amber-500">presupuesto</span>
                        </p>
                    </div>
                    <Link
                        href={"/admin"}
                        className="bg-amber-500 p-2 rounded-lg text-white font-bold w-full md:w-auto text-center"
                    >
                        Volver
                    </Link>
                </div>
                <div className="p-10 mt-10  shadow-lg border border-gray-300 rounded-lg ">
                    <EditBudgetForm 
                        budget={budget}
                    />
                </div>
            </>
    );
}
