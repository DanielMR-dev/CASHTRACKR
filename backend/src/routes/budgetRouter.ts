import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";

const router: Router = Router();

// Routes
router.get('/', BudgetController.getAll);
router.post('/', BudgetController.create);

export default router;