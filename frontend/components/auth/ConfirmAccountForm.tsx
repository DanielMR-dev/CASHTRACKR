"use client"

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PinInput, PinInputField } from "@chakra-ui/pin-input"
import { confirmAccount } from "@/actions/confirm-account-action";

export default function ConfirmAccountForm() {
    const router = useRouter();
    const [isComplete, setIsComplete] = useState(false);
    const [, startTransition] = useTransition();
    const [token, setToken] = useState("");
    const confirmAccountWithToken = confirmAccount.bind(null, token);
    const [state, dispatch] = useActionState(confirmAccountWithToken, {
        errors: [],
        success: { 
            message: "" 
        }
    });

    useEffect(() => {
        if (isComplete){
            startTransition(() => {
                dispatch();
            });
        }
    }, [isComplete]);

    useEffect(() => {
        if (state.errors){
            state.errors.forEach(error => {
                toast.error(error);
            });
        }
        if (state.success.message) {
            toast.success(state.success.message, {
                onClose: () => {
                    router.push("/auth/login");
                }
            });
        }
    }, [state, router]);

    const handleChange = (tokenValue: string) => {
        setIsComplete(false);
        setToken(tokenValue);
    };

    const handleComplete = () => {
        setIsComplete(true);
    };

    return (
        <>
            <div className="flex justify-center gap-5 my-10">
                <PinInput
                    value={token}
                    onChange={handleChange}
                    onComplete={handleComplete}
                >
                    <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg placeholder-white text-center text-2xl" />
                    <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg placeholder-white text-center text-2xl" />
                    <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg placeholder-white text-center text-2xl" />
                    <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg placeholder-white text-center text-2xl" />
                    <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg placeholder-white text-center text-2xl" />
                    <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg placeholder-white text-center text-2xl" />
                </PinInput>
            </div>
        </>
    );
}
