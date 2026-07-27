import { createRequest, createResponse } from "node-mocks-http";
import { validateBudgetExists } from "../../../middleware/budget";
import Budget from "../../../models/Budget";
import { budgets } from "../../mocks/budgets";


jest.mock('../../../models/Budget', () => ({ 
    findByPk: jest.fn()
}));

describe('budget - validateBudgetExists', () => {
    test('Should handle non-existent budget', async () => {
        (Budget.findByPk as jest.Mock).mockResolvedValue(null);
        const req = createRequest({
            params: {
                budgetId: 1
            }
        });
        const res = createResponse();
        const next = jest.fn();
        await validateBudgetExists(req, res, next);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(404);
        expect(data).toStrictEqual({ error: 'Presupuesto no encontrado' });
        expect(next).not.toHaveBeenCalled();
    });

    test('Should handle error', async () => {
        (Budget.findByPk as jest.Mock).mockRejectedValueOnce(new Error);
        const req = createRequest({
            params: {
                budgetId: 1
            }
        });
        const res = createResponse();
        const next = jest.fn();
        await validateBudgetExists(req, res, next);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toStrictEqual({ error: 'Hubo un error al obtener el presupuesto' });
        expect(next).not.toHaveBeenCalled();
    });

    test('Should proceed to next middleware if budget exists', async () => {
        (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0]);
        const req = createRequest({
            params: {
                budgetId: 1
            }
        });
        const res = createResponse();
        const next = jest.fn();
        await validateBudgetExists(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(next).toHaveBeenCalledTimes(1);
        expect(req.budget).toStrictEqual(budgets[0]);
    });
});