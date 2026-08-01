
export default function ErrorMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-lg border border-red-500 bg-red-50 p-5 text-red-600 text-center">
            {children}
        </div>
    )
}
