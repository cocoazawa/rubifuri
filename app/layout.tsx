// layout.tsx
//
// Copyright (C) 2026 cocoazawa

"use client"

import "./globals.css";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            {children}
        </html>
    );
}
