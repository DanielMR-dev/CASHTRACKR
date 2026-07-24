import type { Request, Response } from "express";
import User from "../models/User";

export class AuthController { 
    static createAccount = async (req: Request, res: Response) => {
        const { email} = req.body;
        // Prevenir duplicados
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(409).json({ error: 'Un usuario con ese email ya existe' });
        }
        try {
            const user = new User(req.body);
            await user.save();
            res.status(201).json({ message: '¡Tu cuenta ha sido creada correctamente!' });
        } catch (error) {
            // console.log(error);
            res.status(500).json({ error: 'Error al crear la cuenta' });
        }
    }
}