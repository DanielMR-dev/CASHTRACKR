import { Request, Response, NextFunction } from "express";
import { param, validationResult } from "express-validator";

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {
    await param('id')
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