"use client"
import { PinInput, PinInputField } from "@chakra-ui/pin-input"
import { useState } from "react";

export default function ConfirmAccountForm() {
    const [token, setToken] = useState("");

    const handleChange = (tokenValue: string) => {
        setToken(tokenValue);
    };

    const handleComplete = () => {
        
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
