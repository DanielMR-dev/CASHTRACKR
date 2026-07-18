import { Router, Request, Response } from "express";

const router: Router = Router();

// Routes
router.get('/', (req: Request, res: Response) => {
    console.log('Desde budgetRouter');
});

export default router;