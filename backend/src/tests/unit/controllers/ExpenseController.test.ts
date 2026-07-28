import { createRequest, createResponse } from "node-mocks-http";
import Expense from "../../../models/Expense";
import { ExpensesController } from "../../../controllers/ExpenseController";
import { expenses } from "../../mocks/expenses";

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

    test('Should handle expense creation error', async () => {
        const mockExpense = {
            save: jest.fn()
        };
        (Expense.create as jest.Mock).mockRejectedValue(new Error());
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            budget: { id: 1 },
            body: {
                name: 'Nuevo Presupuesto',
                amount: 1000
            }
        });
        const res = createResponse();
        await ExpensesController.createExpense(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toStrictEqual({ error: 'Error al Crear el gasto' });
        expect(mockExpense.save).not.toHaveBeenCalled();
        expect(Expense.create).toHaveBeenCalledWith(req.body);
    });
});

describe('ExpensesController.getExpenseById', () => {
    test('Should return expense with ID 1', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: expenses[0]
        });
        const res = createResponse();
        await ExpensesController.getExpenseById(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toStrictEqual(expenses[0]);
    });

    test('Should return expense with ID 2', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: expenses[1]
        });
        const res = createResponse();
        await ExpensesController.getExpenseById(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toStrictEqual(expenses[1]);
    });

    test('Should return expense with ID 3', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: expenses[2]
        });
        const res = createResponse();
        await ExpensesController.getExpenseById(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toStrictEqual(expenses[2]);
    });
});

describe('ExpensesController.updateExpenseById', () => {
    test('Should update an expense', async () => {
        const mockExpense = {
            ...expenses[0],
            update: jest.fn().mockResolvedValue(true)
        };
        const req = createRequest({
            method: 'PUT',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: mockExpense,
            body: {
                name: 'Updated Expense',
                amount: 200
            }
        });
        const res = createResponse();
        await ExpensesController.updateExpenseById(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toStrictEqual({ message: 'Gasto actualizado correctamente' });
        expect(mockExpense.update).toHaveBeenCalled();
        expect(mockExpense.update).toHaveBeenCalledWith(req.body);
        expect(mockExpense.update).toHaveBeenCalledTimes(1);
    });

    test('Should handle expense update error', async () => {
        const mockExpense = {
            ...expenses[0],
            update: jest.fn().mockRejectedValue(new Error())
        };
        const req = createRequest({
            method: 'PUT',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: mockExpense,
            body: {
                name: 'Updated Expense',
                amount: 200
            }
        });
        const res = createResponse();
        await ExpensesController.updateExpenseById(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toStrictEqual({ error: 'Error al actualizar el gasto' });
        expect(mockExpense.update).toHaveBeenCalled();
        expect(mockExpense.update).toHaveBeenCalledWith(req.body);
        expect(mockExpense.update).toHaveBeenCalledTimes(1);
    });

    test('Should return 500 error if expense is not present in request', async () => {
        const req = createRequest({
            method: 'PUT',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            body: {
                name: 'Updated Expense',
                amount: 200
            }
        });
        const res = createResponse();
        await ExpensesController.updateExpenseById(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toStrictEqual({ error: 'Error interno: Gasto no disponible' });
    });
});

describe('ExpensesController.deleteExpenseById', () => {
    test('Should delete an expense', async () => {
        const mockExpense = {
            ...expenses[0],
            destroy: jest.fn().mockResolvedValue(true)
        };
        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: mockExpense
        });
        const res = createResponse();
        await ExpensesController.deleteExpenseById(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toStrictEqual({ message: 'Gasto eliminado correctamente' });
        expect(mockExpense.destroy).toHaveBeenCalled();
        expect(mockExpense.destroy).toHaveBeenCalledTimes(1);
    });

    test('Should handle expense deletion error', async () => {
        const mockExpense = {
            ...expenses[0],
            destroy: jest.fn().mockRejectedValue(new Error())
        };
        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: mockExpense
        });
        const res = createResponse();
        await ExpensesController.deleteExpenseById(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toStrictEqual({ error: 'Error al eliminar el gasto' });
        expect(mockExpense.destroy).toHaveBeenCalled();
        expect(mockExpense.destroy).toHaveBeenCalledTimes(1);
    });

    test('Should return 500 error if expense is not present in request', async () => {
        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId/expenses/:expenseId'
        });
        const res = createResponse();
        await ExpensesController.deleteExpenseById(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toStrictEqual({ error: 'Error interno: Gasto no disponible' });
    });
});