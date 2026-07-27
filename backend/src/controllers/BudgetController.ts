import type { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

export class BudgetController { 
    static getAllBudgets = async (req: Request, res: Response) => {
        try {
            const budget = await Budget.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                where: {
                    userId: req.user!.id
                }
            });
            res.status(200).json(budget);
        } catch (error) {
            //console.log(error);
            res.status(500).json({ error: 'Error al obtener los presupuestos' });
        }
    }

    static createBudget = async (req: Request, res: Response) => {
        try {
            const budget = await Budget.create(req.body);
            budget.userId = req.user!.id;    
            await budget.save();
            res.status(201).json({ message: 'Presupuesto Creado correctamente' });
        } catch (error) {
            //console.log(error);
            res.status(500).json({ error: 'Error al Crear el presupuesto' });
        }
    }
    
    static getBudgetById = async (req: Request, res: Response) => {
        try {
            const budget = await Budget.findByPk(req.budget!.id, {
                include: [Expense]
            });
            res.status(200).json(budget);
        } catch (error) {
            // console.log(error);
            res.status(500).json({ error: 'Error al obtener el presupuesto' });
        }
    }

    static updateBudgetById = async (req: Request, res: Response) => {
        try {
            await req.budget!.update(req.body);
            res.status(200).json({ message: 'Presupuesto actualizado correctamente' });
        } catch (error) {
            // console.log(error);
            res.status(500).json({ error: 'Error al actualizar el presupuesto' });
        }
    }


    static deleteBudgetById = async (req: Request, res: Response) => {
        try {
            await req.budget!.destroy();
            res.status(200).json({ message: 'Presupuesto eliminado correctamente' });
        } catch (error) {
            //console.log(error);
            res.status(500).json({ error: 'Error al eliminar el presupuesto' });
        }
    }
}