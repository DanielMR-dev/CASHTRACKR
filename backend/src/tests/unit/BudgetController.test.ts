import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from "../mocks/budgets";
import { BudgetController } from "../../controllers/BudgetController";
import Budget from "../../models/Budget";

jest.mock('../../models/Budget', () => ({ 
    findAll: jest.fn()
}));

describe('BudgetController.getAll', () => {
    test('Should retrieve 2 budgets for user with ID 1', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 1 }
        });
        const res = createResponse();

        const filteredBudgets = budgets.filter(budget => budget.userId === req.user?.id);
        (Budget.findAll as jest.Mock).mockResolvedValue(filteredBudgets);
        await BudgetController.getAllBudgets(req, res);
        const data = res._getJSONData();
        expect(data).toHaveLength(2);
        expect(res.statusCode).toBe(200);
        expect(res.statusCode).not.toBe(404);
    });

    test('Should retrieve 1 budget for user with ID 2', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 2 }
        });
        const res = createResponse();

        const filteredBudgets = budgets.filter(budget => budget.userId === req.user?.id);
        (Budget.findAll as jest.Mock).mockResolvedValue(filteredBudgets);
        await BudgetController.getAllBudgets(req, res);
        const data = res._getJSONData();
        expect(data).toHaveLength(1);
        expect(res.statusCode).toBe(200);
        expect(res.statusCode).not.toBe(404);
    });

    test('Should retrieve 0 budgets for user with ID 10', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 10 }
        });
        const res = createResponse();

        const filteredBudgets = budgets.filter(budget => budget.userId === req.user?.id);
        (Budget.findAll as jest.Mock).mockResolvedValue(filteredBudgets);
        await BudgetController.getAllBudgets(req, res);
        const data = res._getJSONData();
        expect(data).toHaveLength(0);
        expect(res.statusCode).toBe(200);
        expect(res.statusCode).not.toBe(404);
    });
});