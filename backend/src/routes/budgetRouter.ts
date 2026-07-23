import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetExists, validateBudgetId, validateBudgetInput } from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpenseController";
import { validateExpenseExists, validateExpenseId, validateExpenseInput } from "../middleware/expense";

const router: Router = Router();

/* Routes for Budgets */
router.param('budgetId', validateBudgetId);
router.param('budgetId', validateBudgetExists);

router.param('expenseId', validateExpenseId);
router.param('expenseId', validateExpenseExists);

// Get All Budgets
router.get('/', BudgetController.getAllBudgets);

// Create Budget
router.post('/', 
    validateBudgetInput,
    handleInputErrors,
    BudgetController.createBudget
);

// Get Budget by ID
router.get('/:budgetId', BudgetController.getBudgetById);

// Update Budget by ID
router.put('/:budgetId',
    validateBudgetInput,
    handleInputErrors,
    BudgetController.updateBudgetById
);

// Delete Budget by ID
router.delete('/:budgetId', BudgetController.deleteBudgetById);


/* Routes for Expenses */
// Create Expense
router.post('/:budgetId/expenses', 
    validateExpenseInput,
    handleInputErrors,    
    ExpensesController.createExpense
);

// Get Expense by ID
router.get('/:budgetId/expenses/:expenseId', ExpensesController.getExpenseById);

// Update Expense by ID
router.put('/:budgetId/expenses/:expenseId', ExpensesController.updateExpenseById);

// Delete Expense by ID
router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteExpenseById);

export default router;