"use server"

type ActionStateType = {
    errors: string[];
    success: {
        message: string;
    };
};

export async function validateToken(token: string, prevState: ActionStateType) {
    console.log("Desde validateToken");
    return {
        errors: [],
        success: { message: "" },
    }
}