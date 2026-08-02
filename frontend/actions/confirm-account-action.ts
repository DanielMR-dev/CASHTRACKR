"use server"

type ActionStateType = {
    errors: string[];
};

export async function confirmAccount(token: string, prevState: ActionStateType) {
    console.log("Desde confirmAccount");
    return {
        errors: [],
    }
}