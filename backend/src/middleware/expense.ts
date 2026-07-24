import { Request, Response, NextFunction } from "express";
import { param, validationResult, body } from "express-validator";
import Expense from "../models/Expense";

declare global {
    namespace Express {
        interface Request {
            expense?: Expense;
        }
    }
};

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
            .notEmpty().withMessage('El nombre del gasto es requerido')
            .isString().withMessage('El nombre debe ser una cadena de texto')
            .run(req);
    await body('amount')
            .notEmpty().withMessage('La cantidad del gasto es requerido')
            .isNumeric().withMessage('La cantidad debe ser un número')
            .custom((value) => value > 0).withMessage('La cantidad debe ser mayor a 0') // Se debe evaluar como "false", no como "true"
            .run(req);
    next();
};

export const validateExpenseId = async (req: Request, res: Response, next: NextFunction) => {
    await param('expenseId')
            .notEmpty().withMessage('El ID es requerido')
            .isInt().withMessage('El ID no es válido')
            .custom((value) => value > 0).withMessage('El ID no es válido')
            .run(req);
    
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateExpenseExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { expenseId } = req.params;
        const expense = await Expense.findByPk(expenseId as string);
        if (!expense) {
            const error = new Error('Gasto no encontrado');
            return res.status(404).json({ error: error.message });
        }
        req.expense = expense;
        next();
    } catch (error) {
        //console.log(error);
        res.status(500).json({ error: 'Error al actualizar el gasto' });
    };
};