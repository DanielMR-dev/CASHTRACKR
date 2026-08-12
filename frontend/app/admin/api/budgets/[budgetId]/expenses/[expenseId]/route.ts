import { verifySession } from "@/src/auth/dal";
import { getToken } from "@/src/auth/token";

export async function GET(req: Request, { params }: { params: Promise<{ budgetId: string, expenseId: string }> }) {
    await verifySession();
    const token = await getToken();
    const { budgetId, expenseId } = await params;
    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`;
    const request = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });
    const data = await request.json();
    if (!request.ok) {
        return Response.json(data.error || "Error al obtener el gasto", { status: request.status });
    }
    return Response.json(data);
}