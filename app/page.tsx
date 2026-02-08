// page.tsx
//
// Copyright (C) 2026 cocoazawa

"use client"

import { useEffect, useState } from "react";
import { RubifuriConversion_ResponseObject, RubifuriServerRequest, RubifuriServerResponse } from "../backend/definitions.ts";
import { Ban, BookMarked, Milestone, Settings } from "lucide-react";
import { RubifuriSettingsPanel } from "./settings.tsx";
import { RubifuriInformationPanel } from "./information.tsx";


async function createRequest(requestingSentence: string): Promise<RubifuriServerResponse> {
    console.log("Making a request through the Yahoo!デベロッパーネットワーク credentials provided...");

    // The requestingDocument is required to be passed over to the internally run server if anything is going to work.
    // It contains the sentence (in Kanji) to ルビ振り, a uuid to identify this request (although we could probably do without one)
    // and the most important API Key.
    let requestingDocument: RubifuriServerRequest = {
        for: "rubifuri",
        input: requestingSentence
    }

    
    const furiganaRequest = await fetch("http://localhost:62263", {
        method: "POST",
        body: JSON.stringify(requestingDocument),
        credentials: "include",
    })
    const furiganaRequestParsed = await furiganaRequest.json();
    return furiganaRequestParsed;
}

export default function Home() {
    let [interfaceState, setInterfaceState] = useState<"processing" | "information" | "enter" | "settings" | "result" | "error" | "welcome">("processing");

    let [output, setOutput] = useState<string>("");

    function handleFuriganaRequests(input: string) {
        setInterfaceState("processing");
        
        createRequest(input)
        .then((response) => {
            setOutput((response.output as RubifuriConversion_ResponseObject).flattened);
            setInterfaceState("result");
        })
        .catch((error) => {
            setInterfaceState("error");
        })
    }

    useEffect(() => {
        setInterfaceState("welcome");
    }, []);

    return (
        <body>
            <header>
                <a className="logo" onClick={(event) => {setInterfaceState("enter")}}>
                    <h1>rubifuri<sup style={{fontSize: "14px"}}>v0.2</sup></h1>
                </a>
                <div>
                    <button onClick={(event) => {setInterfaceState("information")}} className="credit"><BookMarked height={14} strokeWidth={2.5} /> Information</button>
                    <button onClick={(event) => {setInterfaceState("settings")}} className="credit"><Settings height={14} strokeWidth={2.5} /> Settings</button>
                </div>
            </header>
            <main>
                {interfaceState == "welcome" ? <>
                    <div className="panel">
                        <h1><Milestone strokeWidth={2.25} />&nbsp;Welcome to Rubifuri!</h1>
                        <p>Do you want to configure before continuing?</p>
                        <div className="row">
                            <button onClick={(event) => {setInterfaceState("settings")}}>Yes</button>
                            <button onClick={(event) => {setInterfaceState("enter")}}>No</button>
                        </div>
                        <p><sub>Certain features are only available through details that you provide. Everything is locally stored and your privacy and security come first.</sub></p>
                    </div>
                </> : interfaceState == "processing" ? <>
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
                </> : interfaceState == "settings" ? <>
                    <RubifuriSettingsPanel />
                </> : interfaceState == "information" ? <>
                    <RubifuriInformationPanel />
                </> : <>
                    <div className="panel">
                        <h2 style={{color: "var(--red)", marginLeft: "auto", marginRight: "auto", marginTop: "24px"}}><Ban />&nbsp;Failed to process. Please clear site data and retry.</h2>
                        <button onClick={(event) => {
                            window.location.reload();
                        }}>Continue</button>
                    </div>
                </>}
            </main>
        </body>
    );
}
