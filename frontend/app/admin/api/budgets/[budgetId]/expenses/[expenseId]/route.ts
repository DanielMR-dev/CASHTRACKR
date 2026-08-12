import { verifySession } from "@/src/auth/dal";
import { getToken } from "@/src/auth/token";

export async function GET(req: Request, { params }: { params: { budgetId: string, expenseId: string } }) {
    await verifySession();
    const token = await getToken();
    const url = `${process.env.API_URL}/budgets/${params.budgetId}/expenses/${params.expenseId}`;
    const request = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });
    const data = await request.json();
    if (!data.ok) {
        return Response.json(data.error, { status: 403 });
    }
    return data;
}