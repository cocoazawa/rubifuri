// page.tsx
//
// Copyright (C) 2026 cocoazawa

"use client"

import { Milestone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Welcome() {
    const router = useRouter();

    return (
        <>
            <div className="panel">
                <h1><Milestone strokeWidth={2.25} />&nbsp;Welcome to Rubifuri!</h1>
                <p>Do you want to configure before continuing?</p>
                <div className="row">
                    <button onClick={(event) => {router.push("settings")}}>Yes</button>
                    <button onClick={(event) => {router.push("rubifuri")}}>No</button>
                </div>
                <p><sub>Certain features are only available through details that you provide. Everything is locally stored and your privacy and security come first.</sub></p>
            </div>
        </>
    );
}
