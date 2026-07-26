import { createRequest, createResponse }  from "node-mocks-http";
import { budgets } from "../mocks/budgets";
import { BudgetController } from "../../controllers/BudgetController";

describe('BudgetController.getAll', () => {
    test('Should retrieve 3 budgets', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 1 }
        });
        const res = createResponse();

        await BudgetController.getAllBudgets(req, res);
    });
});