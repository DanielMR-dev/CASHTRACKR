import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

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
        const { email, password } = req.body;
        // Revisar que el Usuario exista
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        // Revisar que la cuenta esté confirmada
        if (!user.confirmed) {
            return res.status(403).json({ error: 'Tu cuenta no ha sido confirmada' });
        }
        const isPasswordCorrect = await checkPassword(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Password Incorrecto' });
        }

        const token = generateJWT(user.id);
        res.status(200).json(token);
    }

    static forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body;
        // Revisar que el Usuario exista
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        try {
            user.token = generateToken();
            await user.save();
            await AuthEmail.sendPasswordResetToken({
                name: user.name,
                email: user.email,
                token: user.token
            });
            res.status(200).json({ message: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al restablecer la contraseña' });
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        const { token } = req.body;
        const tokenExist = await User.findOne({ where: { token } });
        if (!tokenExist) {
            return res.status(404).json({ error: 'Token no válido' });
        }
        res.status(200).json({ message: 'Token válido' });
    }

    static resetPasswordWithToken = async (req: Request, res: Response) => {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({ where: { token } });
        if (!user) {
            return res.status(404).json({ error: 'Token no válido' });
        }
        try {
            user.password = await hashPassword(password);
            user.token = null;
            await user.save();
            res.status(200).json({ message: 'Contraseña restablecida correctamente' });
        } catch (error) {
            // console.log(error);
            res.status(500).json({ error: 'Error al restablecer la contraseña' });
        }
    }

    static getUser = async (req: Request, res: Response) => {
        res.status(200).json(req.user);
    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const { current_password, new_password } = req.body;
        if (!req.user) {
            return res.status(401).json({ error: 'No autorizado' });
        }
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const isPasswordCorrect = await checkPassword(current_password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
        }
        try {
            user.password = await hashPassword(new_password);
            await user.save();
            res.status(200).json('Contraseña actualizada correctamente');
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al actualizar la contraseña' });
        }
    }
}