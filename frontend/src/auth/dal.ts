// Data Access Layer
import "server-only"
import { UserSchema } from "../schemas";
import { cache } from "react";
import { getToken } from "./token";

export const verifySession = cache( async () => {
    try {
        const token = await getToken();
        if (!token) {
            return { isAuth: false, user: null };
        }
        // Validate token
        const url = `${process.env.API_URL}/auth/user`;
        const request = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        if (!request.ok) {
            return { isAuth: false, user: null };
        }
        const session = await request.json();
        const result = UserSchema.safeParse(session);
        if (!result.success) {
            return { isAuth: false, user: null };
        }
        return {
            user: result.data,
            isAuth: true
        }
    } catch (error) {
        console.error("Session verification failed:", error);
        return { isAuth: false, user: null };
    }
});