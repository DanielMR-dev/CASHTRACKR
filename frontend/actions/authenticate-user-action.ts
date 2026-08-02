"use server";

import { LoginSchema } from "@/src/schemas";

export async function authenticate(prevState: any, formData: FormData) {
    const loginCredentials = {
        email: formData.get("email"),
        password: formData.get("password")
    }

    const auth = LoginSchema.safeParse(loginCredentials);

    if (!auth.success) {
        return {
            errors: auth.error.issues.map((issue) => issue.message),
            success: {
                message: ""
            }
        }
    }
}
