import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";

const router: Router = Router();

// Routes
router.get('/', BudgetController.getAll);
router.post('/', BudgetController.create);
router.get('/:id', BudgetController.getBudgetById);
router.put('/:id', BudgetController.updateBudgetById);
router.delete('/:id', BudgetController.deleteBudgetById);

export default router;