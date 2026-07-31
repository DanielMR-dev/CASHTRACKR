import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";


export const metadata: Metadata = {
    title: "CashTrackr - Olvidé mi Password",
    description: "Olvidé mi Password",
};

export default function ForgotPasswordPage() {
    return (
        <>
            <h1 className="font-black text-6xl text-purple-950">¿Olviaste tu Contraseña?</h1>
            <p className="text-3xl font-bold">aquí puedes <span className="text-amber-500">reestablecerla</span></p>
            <ForgotPasswordForm />
        </>
    );
}
