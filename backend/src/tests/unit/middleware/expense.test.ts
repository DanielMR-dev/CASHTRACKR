import { createRequest, createResponse } from "node-mocks-http";
import { validateExpenseExists } from "../../../middleware/expense";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/expenses";
import { hasAccess } from "../../../middleware/budget";
import { budgets } from "../../mocks/budgets";

jest.mock('../../../models/Expense', () => ({ 
    findByPk: jest.fn()
}));

describe('Expenses Middleware - validateExpenseExists', () => {
    beforeEach(() => {
        (Expense.findByPk as jest.Mock).mockReset();
        (Expense.findByPk as jest.Mock).mockImplementation((id) => {
            const expense = expenses.filter(expense => expense.id === id)[0] ?? null;
            return Promise.resolve(expense);
        });
    });

    test('Should handle non-existent expense', async () => {
        const req = createRequest({
            params: {
                expenseId: 10
            }
        });
        const res = createResponse();
        const next = jest.fn();
        await validateExpenseExists(req, res, next);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(404);
        expect(data).toStrictEqual({ error: 'Gasto no encontrado' });
        expect(next).not.toHaveBeenCalled();
    });

    test('Should call next middleware if expense exists', async () => {
        const req = createRequest({
            params: {
                expenseId: 1
            }
        });
        const res = createResponse();
        const next = jest.fn();
        await validateExpenseExists(req, res, next);
        
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(req.expense).toStrictEqual(expenses[0]);
    });

    test('Should handle internal server error', async () => {
        (Expense.findByPk as jest.Mock).mockRejectedValue(new Error());
        const req = createRequest({
            params: {
                expenseId: 1
            }
        });
        const res = createResponse();
        const next = jest.fn();
        await validateExpenseExists(req, res, next);
        const data = res._getJSONData();

        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(500);
        expect(data).toStrictEqual({ error: 'Error al actualizar el gasto' });    
    });

    test('Should prevent unauthorized users from creating expenses', async () => {
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            budget: budgets[0],
            user: { id: 200 },
            body: {
                name: 'Expense Test',
                amount: 3000
            }
        });
        const res = createResponse();
        const next = jest.fn();
        hasAccess(req, res, next);  
        const data = res._getJSONData();

        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(401);
        expect(data).toStrictEqual({ error: 'Acción no autorizada' });
    });
});