import { Request, Response, NextFunction } from "express";
import { param, validationResult, body } from "express-validator";
import Budget from "../models/Budget";

declare global {
    namespace Express {
        interface Request {
            budget?: Budget;
        }
    }
};

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {
    await param('budgetId')
            .notEmpty().withMessage('El ID es requerido')
            .isInt().withMessage('ID no válido')
            .custom(value => value > 0).withMessage('ID no válido')
            .run(req);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

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
    };
};

export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
            .notEmpty().withMessage('El nombre del presupuesto es requerido')
            .isString().withMessage('El nombre debe ser una cadena de texto')
            .run(req);
    await body('amount')
            .notEmpty().withMessage('La cantidad del presupuesto es requerido')
            .isNumeric().withMessage('La cantidad debe ser un número')
            .custom((value) => value > 0).withMessage('La cantidad debe ser mayor a 0') // Se debe evaluar como "false", no como "true"
            .run(req);
    next();
};