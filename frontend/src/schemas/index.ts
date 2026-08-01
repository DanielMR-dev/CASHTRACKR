import { z } from "zod";

export const RegisterSchema = z.object({
    email: z.email({message: 'Email no valido'})
                .min(1, {message: 'El email es requerido'}),
    name: z.string()
                .min(1, {message: 'El nombre es requerido'}),
    password: z.string()
                .min(8, {message: 'El password debe tener al menos 8 caracteres'}),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Los passwords no coinciden',
    path: ['password_confirmation'],
});
    