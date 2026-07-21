import type { Request, Response } from "express";

export class BudgetController { 
    static getAll = async (req: Request, res: Response) => {
        console.log('Obteniendo desde budgetRouter');
    }

    static create = async (req: Request, res: Response) => {
        console.log('Creando desde budgetRouter');
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