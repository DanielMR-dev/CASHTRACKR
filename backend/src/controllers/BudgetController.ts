import type { Request, Response } from "express";
import Budget from "../models/Budget";

export class BudgetController { 
    static getAll = async (req: Request, res: Response) => {
        try {
            const budget = await Budget.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                // TODO: Filtrar por el usuario autenticado
            });
            res.status(200).json(budget);
        } catch (error) {
            //console.log(error);
            res.status(500).json({ error: 'Error al obtener los presupuestos' });
        }
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
    
    static getBudgetById = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            const budget = await Budget.findByPk(id);
            if (!budget) {
                const error = new Error('Presupuesto no encontrado');
                return res.status(404).json({ error: error.message });
            }
            res.status(200).json(budget);
        } catch (error) {
            //console.log(error);
            res.status(500).json({ error: 'Error al obtener el presupuesto' });
        }
    }

    static updateBudgetById = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            const budget = await Budget.findByPk(id);
            if (!budget) {
                const error = new Error('Presupuesto no encontrado');
                return res.status(404).json({ error: error.message });
            }
            // Escribir los cambios del body
            await budget.update(req.body);
            res.status(200).json({ message: 'Presupuesto actualizado correctamente' });
        } catch (error) {
            //console.log(error);
            res.status(500).json({ error: 'Error al actualizar el presupuesto' });
        }
    }

    static deleteBudgetById = async (req: Request, res: Response) => {
        console.log('Eliminando desde deleteBudgetById');
    }
}