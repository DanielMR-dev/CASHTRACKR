import type { Request, Response } from "express";
import Budget from "../models/Budget";

export class BudgetController { 
    static getAll = async (req: Request, res: Response) => {
        console.log('Obteniendo desde budgetRouter');
    }

    static create = async (req: Request, res: Response) => {
        try {
            const budget = new Budget(req.body);
            await budget.save();
            res.status(201).json({ message: 'Presupuesto Creado correctamente' });
        } catch (error) {
            //console.log(error);
            res.status(500).json({ error: 'Error al Crear el presupuesto' });
        }
    }
    
    static getBudgetById = async (req: Request, res: Response) => {
        console.log('Obteniendo desde getBudgetById');
    }

    static updateBudgetById = async (req: Request, res: Response) => {
        console.log('Actualizando desde updateBudgetById');
    }

    static deleteBudgetById = async (req: Request, res: Response) => {
        console.log('Eliminando desde deleteBudgetById');
    }
}