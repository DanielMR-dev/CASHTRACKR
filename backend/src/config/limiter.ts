import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 5, // 5 peticiones por minuto
    message: { error: "Has alcanzado el límite de peticiones" },
});