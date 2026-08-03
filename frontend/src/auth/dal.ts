// Data Access Layer
import { cookies } from "next/headers"
import { redirect } from "next/navigation";

export const verifySession = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("CASHTRACKR_TOKEN")?.value;
        if (!token) {
            redirect("/auth/login")
        }
    } catch (error) {
        
    }

}