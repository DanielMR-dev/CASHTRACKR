import { createRequest, createResponse } from "node-mocks-http";
import { validateExpenseExists } from "../../../middleware/expense";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/expenses";

jest.mock('../../../models/Expense', () => ({ 
    findByPk: jest.fn()
}));

describe('Expenses Middleware - validateExpenseExists', () => {
    
});