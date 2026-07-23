import { Request, Response, NextFunction } from "express";
import { param, validationResult } from "express-validator";
import Budget from "../models/Budget";

declare global {
    namespace Express {
        interface Request {
            budget?: Budget;
        }
    }
}

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {
    await param('budgetId')
            .notEmpty().withMessage('El ID es requerido')
            .isInt().withMessage('ID no válido')
            .custom(value => value > 0).withMessage('ID no válido')
            .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const validateBudgetExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { budgetId } = req.params;
        const budget = await Budget.findByPk(budgetId as string);
        if (!budget) {
            const error = new Error('Presupuesto no encontrado');
            return res.status(404).json({ error: error.message });
        }
        req.budget = budget;
        next();
    } catch (error) {
        //console.log(error);
        res.status(500).json({ error: 'Error al actualizar el presupuesto' });
    }
}