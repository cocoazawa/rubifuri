// global-not-found.tsx
//
// Copyright (C) 2026 cocoazawa

"use client"

import { useRouter } from "next/navigation";
import "./globals.css";
import { BookMarked, FolderX, Settings } from "lucide-react";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    return (
        <html lang="en">
            <body>
                <header>
                    <a className="logo" onClick={(event) => { router.push("rubifuri") }}>
                        <h1>rubifuri<sup style={{ fontSize: "14px" }}>v0.2</sup></h1>
                    </a>
                </header>
                <main>
                    <h1><FolderX strokeWidth={2.25} />&nbsp;Resource Not Found</h1>
                    <p>Sorry, but we couldn't find what you were looking for. <a href="/">Go to the Welcome screen</a></p>
                </main>
            </body>
        </html>
    );
}
