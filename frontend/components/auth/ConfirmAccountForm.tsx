"use client"
import { PinInput, PinInputField } from "@chakra-ui/pin-input"

export default function ConfirmAccountForm() {
    return (
        <div className="flex justify-center gap-5 my-10">
            <PinInput>
                <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg placeholder-white text-center text-2xl" />
                <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg placeholder-white text-center text-2xl" />
                <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg placeholder-white text-center text-2xl" />
                <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg placeholder-white text-center text-2xl" />
                <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg placeholder-white text-center text-2xl" />
                <PinInputField className="h-10 w-10 border border-gray-300 shadow rounded-lg placeholder-white text-center text-2xl" />
            </PinInput>
        </div>
    ) 
}
