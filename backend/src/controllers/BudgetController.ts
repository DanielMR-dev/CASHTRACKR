import type { Request, Response } from "express";

export class BudgetController { 
    static getAll = async (req: Request, res: Response) => {
        console.log('Obteniendo desde budgetRouter');
    }

    static create = async (req: Request, res: Response) => {
        console.log('Creando desde budgetRouter');
    }
}