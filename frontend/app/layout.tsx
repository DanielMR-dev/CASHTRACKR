import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CashTrackr",
};

export default function RootLayout({
  children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={outfit.className}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
