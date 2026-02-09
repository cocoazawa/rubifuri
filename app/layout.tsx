// layout.tsx
//
// Copyright (C) 2026 cocoazawa

"use client"

import { useRouter } from "next/navigation";
import "./globals.css";
import { BookMarked, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getBackgroundThroughBackend } from "./utilities";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    let [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
    let imageRef = useRef<HTMLImageElement>(null);

    let runOnce = useRef<boolean>(false);

    useEffect(() => {
        if (runOnce.current === true || imageRef.current === null) { return; }
        runOnce.current = true;

        imageRef.current.addEventListener("load", (event) => {
            imageRef.current!.classList.add("loaded");
        })

        getBackgroundThroughBackend()
            .then((value) => {
                setImageSrc(value);
            })
    })

    return (
        <html lang="en">
            <body>
                <header>
                    <a className="logo" onClick={(event) => { router.push("rubifuri") }}>
                        <h1>rubifuri<sup style={{ fontSize: "14px" }}>v0.2</sup></h1>
                    </a>
                    <div>
                        <button onClick={(event) => { router.push("information") }} className="credit"><BookMarked height={14} strokeWidth={2.5} /> Information</button>
                        <button onClick={(event) => { router.push("settings") }} className="credit"><Settings height={14} strokeWidth={2.5} /> Settings</button>
                    </div>
                </header>
                <main>
                    {children}
                </main>
                <img ref={imageRef} src={imageSrc} className="background"></img>
            </body>
        </html>
    );
}
