import type { Request, Response } from 'express'
import Expense from '../models/Expense';

export class ExpensesController {
    static createExpense = async (req: Request, res: Response) => {
        try {
            const expense = new Expense(req.body);
            expense.budgetId = req.budget?.id;
            await expense.save();
            res.status(201).json({ message: 'Gasto Creado correctamente' });
        } catch (error) {
            //console.log(error);
            res.status(500).json({ error: 'Error al Crear el gasto' });
        }
    }
  
    static getExpenseById = async (req: Request, res: Response) => {
        res.status(200).json(req.expense);
    }

    static updateExpenseById = async (req: Request, res: Response) => {
        if (!req.expense) {
            return res.status(500).json({ error: 'Error interno: Gasto no disponible' });
        }
        try {
            await req.expense.update(req.body);
            res.status(200).json({ message: 'Gasto actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el gasto' });
        }
    }
  
    static deleteExpenseById = async (req: Request, res: Response) => {
        if (!req.expense) {
            return res.status(500).json({ error: 'Error interno: Gasto no disponible' });
        }
        try {
            await req.expense.destroy();
            res.status(200).json({ message: 'Gasto eliminado correctamente' });
        } catch (error) {
            //console.log(error);
            res.status(500).json({ error: 'Error al eliminar el gasto' });
        }
    }
}