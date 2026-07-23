import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetId } from "../middleware/budget";

const router: Router = Router();

// Routes
router.get('/', BudgetController.getAll);

router.post('/', 
    body('name')
        .notEmpty().withMessage('El nombre del presupuesto es requerido')
        .isString().withMessage('El nombre debe ser una cadena de texto'),
    body('amount')
        .notEmpty().withMessage('La cantidad del presupuesto es requerido')
        .isNumeric().withMessage('La cantidad debe ser un número')
        .custom((value) => value > 0).withMessage('La cantidad debe ser mayor a 0'), // Se debe evaluar como "false", no como "true"
    handleInputErrors,
    BudgetController.create
);

router.get('/:id', 
    validateBudgetId,
    BudgetController.getBudgetById
);

router.put('/:id', 
    validateBudgetId,
    body('name')
        .notEmpty().withMessage('El nombre del presupuesto es requerido')
        .isString().withMessage('El nombre debe ser una cadena de texto'),
    body('amount')
        .notEmpty().withMessage('La cantidad del presupuesto es requerido')
        .isNumeric().withMessage('La cantidad debe ser un número')
        .custom((value) => value > 0).withMessage('La cantidad debe ser mayor a 0'), // Se debe evaluar como "false", no como "true"
    handleInputErrors,
    BudgetController.updateBudgetById
);

router.delete('/:id', 
    validateBudgetId,
    BudgetController.deleteBudgetById
);

export default router;