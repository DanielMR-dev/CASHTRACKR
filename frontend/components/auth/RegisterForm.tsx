"use client"

import { register } from "@/actions/create-account-action";
import { useActionState } from "react";
import ErrorMessage from "../ui/ErrorMessage";
import SuccessMessage from "../ui/SuccessMessage";

export default function RegisterForm() {
    const [state, formAction] = useActionState(register, {
        errors: [],
        success: {
            message: ""
        },
        email: "",
        name: ""
    });

    return (
        <form
                className="mt-10 space-y-5"
                noValidate
                action={formAction}
            >
                {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)}
                {state.success.message && <SuccessMessage>{state.success.message}</SuccessMessage>}
                <div className="flex flex-col gap-2">
                    <label
                        className="font-bold text-2xl"
                        htmlFor="email"
                    >Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        name="email"
                        defaultValue={state.email || ''}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        className="font-bold text-2xl"
                    >Nombre</label>
                    <input
                        type="text"
                        placeholder="Nombre de Registro"
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        name="name"
                        defaultValue={state.name || ''}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        className="font-bold text-2xl"
                    >Password</label>
                    <input
                        type="password"
                        placeholder="Password de Registro"
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        name="password"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        className="font-bold text-2xl"
                    >Repetir Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Repite Password de Registro"
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        name="password_confirmation"
                    />
                </div>

                <input
                    type="submit"
                    value='Registrarme'
                    className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer block"
                />
            </form>
    );
}
