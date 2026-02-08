// page.tsx
//
// Copyright (C) 2026 cocoazawa

"use client"

import { useEffect, useState } from "react";
import { RubifuriServerRequest, RubifuriServerResponse } from "../backend/definitions.ts";
import { v4 as uuid } from "uuid";
import { BookMarked, Milestone, Settings } from "lucide-react";
import { RubifuriConfiguration } from "./definitions.ts";
import { RubifuriSettingsPanel } from "./settings.tsx";


function createRequest(requestingSentence: string): Promise<RubifuriServerResponse> { return new Promise<RubifuriServerResponse>((resolve, reject) => {
    console.log("Making a request through the Yahoo!デベロッパーネットワーク credentials provided...");

    // The requestingDocument is required to be passed over to the internally run server if anything is going to work.
    // It contains the sentence (in Kanji) to ルビ振り, a uuid to identify this request (although we could probably do without one)
    // and the most important API Key.
    let requestingDocument: RubifuriServerRequest = {
        for: "rubifuri",
        input: requestingSentence
    }

    
    fetch("http://localhost:62263", {
        method: "POST",
        body: JSON.stringify(requestingDocument)
    })
    .then((response) => {
        return(response.json());
    })
    .then((secondaryResponse) => {
        resolve(secondaryResponse);
    })
    .catch((error) => {
        console.error(error);
        reject("Failed on either the first layer client or the second layer client.");
    });
})}

export default function Home() {
    let [interfaceState, setInterfaceState] = useState<"processing" | "enter" | "settings" | "result" | "error" | "welcome">("welcome");

    let [output, setOutput] = useState<string>("");

    useEffect(() => {
        
    }, []);



    return (
        <body>
            <header>
                <h1>rubifuri<sup style={{fontSize: "14px"}}>v0.2</sup></h1>
                <div>
                    <button onClick={(event) => {setInterfaceState("settings")}} className="credit"><BookMarked height={14} strokeWidth={2.5} /> Information</button>
                    <button onClick={(event) => {setInterfaceState("settings")}} className="credit"><Settings height={14} strokeWidth={2.5} /> Settings</button>
                </div>
            </header>
            <main>
                {interfaceState == "welcome" ? <>
                    <div className="panel">
                        <h1><Milestone strokeWidth={2.25} />&nbsp;Welcome to Rubifuri!</h1>
                        <p>Before you continue, please configure Rubifuri. Do you want to configure before continuing?</p>
                        <div className="row">
                            <button onClick={(event) => {setInterfaceState("settings")}}>Yes</button>
                            <button onClick={(event) => {setInterfaceState("enter")}}>No</button>
                        </div>
                        <p><sub>Certain features are only available through details that you provide. Everything is locally stored and your privacy comes first.</sub></p>
                    </div>
                </> : interfaceState == "processing" ? <>
                    <div className="panel">
                        <h1><span className="loader"></span>Working</h1>
                        <p>Processing information...</p>
                        <span className="loader"></span>
                    </div>
                </> : interfaceState == "enter" ? <>
                    <div className="panel">
                        <h1>Input</h1>
                        <input id="in" placeholder="Kanji Input"></input>
                        <button onClick={(event) => {
                            const input = (document.getElementById("in") as HTMLInputElement).value;
                            console.log(input);
                            createRequest(input);
                        }}>Request Furigana</button>
                    </div>
                </> : interfaceState == "result" ? <>
                    <div className="panel">
                        <h1>Output</h1>
                        <p>{output}</p>
                    </div>
                </> : interfaceState == "settings" ? <>
                    <RubifuriSettingsPanel />
                </> : <>
                    <div className="panel">
                        <h2>Error</h2>
                        <p>There was an error handling your request.</p>
                        <button onClick={(event) => {

                        }}>Continue</button>
                    </div>
                </>}
            </main>
        </body>
    );
}
