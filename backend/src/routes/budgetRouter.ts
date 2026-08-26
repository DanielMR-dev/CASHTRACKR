import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { hasAccess, validateBudgetExists, validateBudgetId, validateBudgetInput } from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpenseController";
import { belongsToBudget, validateExpenseExists, validateExpenseId, validateExpenseInput } from "../middleware/expense";
import { authenticate } from "../middleware/auth";

const router: Router = Router();


/* Routes for Budgets */

// Protect routes
router.use(authenticate);

// Validate params
router.param('budgetId', validateBudgetId);
router.param('budgetId', validateBudgetExists);
router.param('budgetId', hasAccess);

router.param('expenseId', validateExpenseId);
router.param('expenseId', validateExpenseExists);
router.param('expenseId', belongsToBudget);

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
router.put('/:budgetId/expenses/:expenseId', 
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.updateExpenseById
);

// Delete Expense by ID
router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteExpenseById);

export default router;