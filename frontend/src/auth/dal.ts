// Data Access Layer
import "server-only"
import { redirect } from "next/navigation";
import { UserSchema } from "../schemas";
import { cache } from "react";
import { getToken } from "./token";

export const verifySession = cache( async () => {
    try {
        const token = getToken();
        if (!token) {
            redirect("/auth/login");
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
            redirect("/auth/login");
        }
        const session = await request.json();
        const result = UserSchema.safeParse(session);
        if (!result.success) {
            redirect("/auth/login");
        }
        return {
            user: result.data,
            isAuth: true
        }
    } catch (error) {
        console.log(error);
        redirect("/auth/login");
    }
});