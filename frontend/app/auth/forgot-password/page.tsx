import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";


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
            <nav className="mt-8 flex flex-col space-y-4">
                <Link
                    href="/auth/login"
                    className="text-center text-gray-500 font-medium hover:text-purple-600"
                >
                    ¿Ya tienes cuenta? Inicia Sesión
                </Link>
                <Link
                    href="/auth/register"
                    className="text-center text-gray-500 font-medium hover:text-purple-600"
                >
                    ¿No tienes cuenta? Crea una
                </Link>
            </nav>
        </>
    );
}
