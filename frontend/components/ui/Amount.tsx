import { formatCurrency } from "@/src/utils";

type AmountProps = {
    label: string;
    amount: number;
}

export default function Amount({ label, amount }: AmountProps) {
    return (
        <div className="bg-white shadow p-5 rounded-lg border border-gray-200">
            <p className="text-2xl font-semibold text-gray-900">{label}</p>
            <p className="text-3xl font-bold text-amber-500">{formatCurrency(amount)}</p>
        </div>
    );
}
