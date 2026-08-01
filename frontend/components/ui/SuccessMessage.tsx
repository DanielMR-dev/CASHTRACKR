
export default function SuccessMessage({ children }:{ children: React.ReactNode; }) {
    return (
        <div className="bg-green-500 p-2 rounded-lg text-center text-white font-bold">
            {children}
        </div>
    )
}
