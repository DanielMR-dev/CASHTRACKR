import { z } from "zod";

export const RegisterSchema = z.object({
    email: z.email({message: 'Email no válido'})
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

export const SuccessSchema = z.object({
    message: z.string()
});
export const ErrorResponseSchema = z.object({
    error: z.string()
});

export const TokenSchema = z.string({message: 'Token no válido'})
                                .length(6, {message: 'Token no válido'});