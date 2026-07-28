import { createRequest, createResponse } from "node-mocks-http";
import Expense from "../../../models/Expense";
import { ExpensesController } from "../../../controllers/ExpenseController";

jest.mock('../../../models/Expense', () => ({
    create: jest.fn()
}));

describe('ExpensesController.createExpense', () => {
    test('Should create a new expense', async () => {
        const mockExpense = {
            save: jest.fn().mockResolvedValue(true)
        };
        (Expense.create as jest.Mock).mockResolvedValue(mockExpense);
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            body: {
                name: 'Test Expense',
                amount: 100
            },
            budget: { id: 1 }
        });
        const res = createResponse();
        await ExpensesController.createExpense(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(201);
        expect(data).toStrictEqual({ message: 'Gasto Creado correctamente' });
        expect(mockExpense.save).toHaveBeenCalled();
        expect(mockExpense.save).toHaveBeenCalledTimes(1);
        expect(Expense.create).toHaveBeenCalledWith(req.body);
    });
});