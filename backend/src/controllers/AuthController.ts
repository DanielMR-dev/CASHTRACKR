import type { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController { 
    static createAccount = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        // Prevenir duplicados
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(409).json({ error: 'Un usuario con ese email ya existe' });
        }
        try {
            const user = new User(req.body);
            user.password = await hashPassword(password);
            user.token = generateToken();
            await user.save();
            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            });
            res.status(201).json({ message: '¡Tu cuenta ha sido creada correctamente!' });
        } catch (error) {
            // console.log(error);
            res.status(500).json({ error: 'Error al crear la cuenta' });
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        const { token } = req.body;
        const user = await User.findOne({ where: { token } });
        if (!user) {
            return res.status(401).json({ error: 'Token no válido' });
        }
        try {
            user.confirmed = true;
            user.token = null;
            await user.save();
            res.status(201).json({ message: '¡Tu cuenta ha sido confirmada correctamente!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al confirmar la cuenta' });
        }
    }

    static login = async (req: Request, res: Response) => {
        const { email } = req.body;
        // Revisar que el Usuario exista
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        // Revisar que la cuenta esté confirmada
        if (!user.confirmed) {
            return res.status(403).json({ error: 'Tu cuenta no ha sido confirmada' });
        }
        
        res.json(user);
    }
}