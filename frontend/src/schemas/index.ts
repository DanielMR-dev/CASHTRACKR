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

export const LoginSchema = z.object({
    email: z.email({message: 'Email no válido'})
                .min(1, {message: 'El email es requerido'}),
    password: z.string()
                .min(1, {message: 'El password es requerido'})
})

export const SuccessSchema = z.object({
    message: z.string()
});
export const ErrorResponseSchema = z.object({
    error: z.string()
});

export const TokenSchema = z.string({message: 'Token no válido'})
                                .length(6, {message: 'Token no válido'});

export const ForgotPasswordSchema = z.object({
    email: z.email({message: 'Email no válido'})
                .min(1, {message: 'El email es requerido'}),
});

export const ResetPasswordSchema = z.object({
        password: z.string()
                .min(8, {message: 'El Password debe ser de al menos 8 caracteres'}),
        password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
        message: "Los Passwords no son iguales",
        path: ["password_confirmation"]
});

export const DraftBudgetSchema = z.object({
        name: z.string()
                .min(1, {message: 'El nombre del presupuesto es requerido'}),
        amount: z.coerce.
                number({message: 'Cantidad no válida'})
                .min(1, {message: 'Cantidad no válida'}),
});

export const PasswordValidationSchema = z.string().min(1, { message: 'Password requerido' })

export const DraftExpenseSchema = z.object({
        name: z.string()
                .min(1, {message: 'El nombre del gasto es requerido'}),
        amount: z.coerce.
                number({message: 'Cantidad no válida'})
                .min(1, {message: 'Cantidad no válida'}),
});

export const BudgetAPIResponseSchema = z.object({
        id: z.number(),
        name: z.string(),
        amount: z.string(),
        userId: z.number(),
        createdAt: z.string(),
        updatedAt: z.string()
});
export type Budget = z.infer<typeof BudgetAPIResponseSchema>;

export const UserBudgetsResponseSchema = z.array(BudgetAPIResponseSchema);

export const UserSchema = z.object({
        id: z.number(),
        name: z.string(),
        email: z.email()
});
export type User = z.infer<typeof UserSchema>;
