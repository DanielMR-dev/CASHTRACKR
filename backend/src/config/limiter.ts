import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: process.env.NODE_ENV === 'production' ? 5 : 100, // 5 peticiones por minuto
    message: { error: "Has alcanzado el límite de peticiones" },
});