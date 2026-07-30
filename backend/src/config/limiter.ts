import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 100, // 5 peticiones por minuto
    message: { error: "Has alcanzado el límite de peticiones" },
});