
export default function ErrorMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-red-500 p-2 rounded-lg text-center text-white font-bold">
            {children}
        </div>
    )
}
