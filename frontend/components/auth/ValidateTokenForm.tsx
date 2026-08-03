import { useActionState, useEffect, useTransition, useState } from "react";
import { validateToken } from "@/actions/validate-token-action";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { toast } from "react-toastify";

export default function ValidateTokenForm() {

    const [isComplete, setIsComplete] = useState(false);
    const [, startTransition] = useTransition();
    const [token, setToken] = useState("");
    const validateTokenInput = validateToken.bind(null, token);
    
    const [state, dispatch] = useActionState(validateTokenInput, {
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
            toast.success(state.success.message);
        }
    }, [state]);


    const handleChange = (tokenValue: string) => {
        setIsComplete(false);
        setToken(tokenValue);
    };

    const handleComplete = () => {
        setIsComplete(true);
    };

    return (
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
    );
}