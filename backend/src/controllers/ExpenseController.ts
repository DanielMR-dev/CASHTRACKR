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

    }

    static updateExpenseById = async (req: Request, res: Response) => {
 
    }
  
    static deleteExpenseById = async (req: Request, res: Response) => {

    }
}