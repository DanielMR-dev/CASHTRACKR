import { createRequest, createResponse } from "node-mocks-http";
import { validateExpenseExists } from "../../../middleware/expense";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/expenses";

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
});