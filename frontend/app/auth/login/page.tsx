import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
    title: "CashTrackr - Iniciar Sesión",
    description: "Inicia sesión para controlar tus finanzas",
    keywords: ["finanzas", "dinero", "ahorro", "inversión", "presupuesto", "gastos", "ingresos", "control", "personal", "finanzas-personales", "finanzas-personales-control", "finanzas-personales-dinero", "finanzas-personales-ahorro", "finanzas-personales-inversión", "finanzas-personales-presupuesto", "finanzas-personales-gastos", "finanzas-personales-ingresos", "finanzas-personales-control", "finanzas-personales-control-dinero", "finanzas-personales-control-ahorro", "finanzas-personales-control-inversión", "finanzas-personales-control-presupuesto", "finanzas-personales-control-gastos", "finanzas-personales-control-ingresos", "finanzas-personales-control-control", "finanzas-personales-control-control-dinero", "finanzas-personales-control-control-ahorro", "finanzas-personales-control-control-inversión", "finanzas-personales-control-control-presupuesto", "finanzas-personales-control-control-gastos", "finanzas-personales-control-control-ingresos", "finanzas-personales-control-control-control", "finanzas-personales-control-control-control-dinero", "finanzas-personales-control-control-control-ahorro", "finanzas-personales-control-control-control-inversión", "finanzas-personales-control-control-control-presupuesto", "finanzas-personales-control-control-control-gastos", "finanzas-personales-control-control-control-ingresos", "finanzas-personales-control-control-control-control"]
};

export default function LoginPage() {
    return (
        <>
            <h1 className="font-black text-6xl text-purple-950">Inicia Sesión</h1>
            <p className="text-3xl font-bold">y controla tus <span className="text-amber-500">finanzas</span></p>
            <LoginForm />
            <nav className="mt-8 flex flex-col space-y-4">
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
