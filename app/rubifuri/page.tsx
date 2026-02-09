// page.tsx
//
// Copyright (C) 2026 cocoazawa

"use client"

import { useState } from "react";
import { RubifuriConversion_ResponseObject } from "@/backend/definitions.ts";
import { Ban } from "lucide-react";
import { convertToFurigana } from "../utilities.ts";


export default function Rubifuri() {
    let [interfaceState, setInterfaceState] = useState<"processing" | "enter" | "result" | "error">("enter");

    let [output, setOutput] = useState<string>("");

    function handleFuriganaRequests(input: string) {
        setInterfaceState("processing");
        
        convertToFurigana(input)
        .then((response) => {
            setOutput((response.output as RubifuriConversion_ResponseObject).flattened);
            setInterfaceState("result");
        })
        .catch((error) => {
            setInterfaceState("error");
        })
    }

    return (
        <>
            {interfaceState == "processing" ? <>
                <h2 style={{marginLeft: "auto", marginRight: "auto", marginTop: "24px"}}><span className="loader" data-type="header" />&nbsp;Processing information...</h2>
            </> : interfaceState == "enter" ? <>
                <div className="panel">
                    <h1>Input</h1>
                    <input id="in" placeholder="Kanji Input"></input>
                    <button onClick={(event) => {
                        const input = (document.getElementById("in") as HTMLInputElement).value;
                        handleFuriganaRequests(input);
                    }}>Request Furigana</button>
                </div>
            </> : interfaceState == "result" ? <>
                <div className="panel">
                    <h1>Output</h1>
                    <p>{output}</p>
                </div>
            </> : <>
                <div className="panel">
                    <h2 style={{color: "var(--red)", marginLeft: "auto", marginRight: "auto", marginTop: "24px"}}><Ban />&nbsp;Failed to process. Please clear site data and retry.</h2>
                    <button onClick={(event) => {
                        window.location.reload();
                    }}>Continue</button>
                </div>
            </>}
        </>
    );
}
