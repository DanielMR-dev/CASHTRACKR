import { getToken } from "@/src/auth/token";
import { BudgetAPIResponseSchema } from "@/src/schemas";

const getBudget = async (budgetId: string) => {
    const token = await getToken();
    const url = `${process.env.API_URL}/budgets/${budgetId}`;
    const request = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await request.json();
    const budget = BudgetAPIResponseSchema.parse(data);
    return budget;
}

export default async function EditBudgetPage({ params }: {params: {id: string}}) {
    const { id } = await params;
    const budget = await getBudget(id);
    return (
        <div>EditBudgetPage</div>
    );
}
