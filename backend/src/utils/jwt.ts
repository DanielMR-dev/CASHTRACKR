import jwt from "jsonwebtoken";

export const generateJWT = (id: string): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET no está definido');
    }
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '10d'
    });
    return token;
}