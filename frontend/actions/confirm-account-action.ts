"use server"

type ActionStateType = {
    errors: string[];
};

export async function confirmAccount(prevState: ActionStateType) {
    console.log("Desde confirmAccount");
    return {
        errors: [],
    }
}