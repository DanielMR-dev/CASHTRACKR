import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    const [ , token] = bearer.split(' ');
    if (!token) {
        return res.status(401).json({ error: 'Token no válido' });
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET no está definido');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof decoded !== 'object' || !decoded.id) {
            return res.status(401).json({ error: 'Token no válido' });
        }
        const user = await User.findByPk(decoded.id, {
            attributes: ['id', 'name', 'email']
        });
        if (!user) {
            return res.status(401).json({ error: 'Token no válido' });
        }
        req.user = user;
    } catch (error) {
        return res.status(500).json({ error: 'Token no válido' });
    }
    next();
}