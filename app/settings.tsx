// settings.tsx
//
// Copyright (C) 2026 cocoazawa

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { isLocalStorageAvailable, pingServer, RubifuriConfiguration } from "./definitions";
import { Ban, CheckCheck, CircleSlash, Server, ServerCrash, Settings } from "lucide-react";
import { RubifuriAuthentication_CheckResponseObject, RubifuriServerRequest, RubifuriServerResponse } from "@/backend/definitions";

async function makeConfigurationChange(attribute: "yahoo_apiKey" | "unsplash_apiKey" | "name" | "language", value: string | "en" | "jp"): Promise<void> {
    if (!isLocalStorageAvailable()) { throw new Error("[Rubifuri] LocalStorage isn't available."); }
    if ((value !== "en" && value !== "jp") && attribute === "language") { throw new Error("[Rubifuri] Language can not be set to that language."); }

    if (attribute === "language" || attribute === "name") {
        switch (attribute) {
            case "name":
                localStorage.setItem("config.name", value);
                break;
            case "language":
                localStorage.setItem("config.language", value);
                break;
        }
        return;
    }

    let requestingDocument: RubifuriServerRequest = {
        for: "authentication",
        input: JSON.stringify({
            purpose: "set",
            key: attribute,
            value: value
        })
    }

    fetch("http://localhost:62263", {
        method: "POST",
        body: JSON.stringify(requestingDocument),
        credentials: "include"
    })
    .then((response) => {
        return (response.json());
    })
    .then((secondaryResponse) => {
        console.log(secondaryResponse);
        return;
    })
    .catch((error) => {
        throw error;
    });
}

async function checkConfigurationValues(): Promise<RubifuriConfiguration> {
    let configuration: RubifuriConfiguration = {
        name: localStorage.getItem("config.name") ?? "",
        language: "en",
        yahoo_apiKey: false,
        unsplash_apiKey: false
    };

    configuration.language = localStorage.getItem("config.language") === "en" ? "en" : localStorage.getItem("config.language") === "jp" ? "jp" : "en";

    let requestingDocumentYahoo: RubifuriServerRequest = {
        for: "authentication",
        input: JSON.stringify({
            purpose: "check",
            key: "yahoo_apiKey",
            value: ""
        })
    }
    let requestingDocumentUnsplash: RubifuriServerRequest = {
        for: "authentication",
        input: JSON.stringify({
            purpose: "check",
            key: "unsplash_apiKey",
            value: ""
        })
    }

    const yahooResponse = await fetch("http://localhost:62263", {
        method: "POST",
        body: JSON.stringify(requestingDocumentYahoo),
        credentials: "include"
    })
    const yahooResponseParsed: RubifuriServerResponse = await yahooResponse.json() as RubifuriServerResponse;
    const yahooValueIsSet = (yahooResponseParsed.output as RubifuriAuthentication_CheckResponseObject).valueIsSet;
    console.log(yahooResponseParsed);
    configuration.yahoo_apiKey = yahooValueIsSet;

    const unsplashResponse = await fetch("http://localhost:62263", {
        method: "POST",
        body: JSON.stringify(requestingDocumentUnsplash),
        credentials: "include"
    });
    const unsplashResponseParsed: RubifuriServerResponse = await unsplashResponse.json() as RubifuriServerResponse;
    console.log(unsplashResponseParsed);
    const unsplashValueIsSet = (unsplashResponseParsed.output as RubifuriAuthentication_CheckResponseObject).valueIsSet;
    configuration.unsplash_apiKey = unsplashValueIsSet;

    return configuration;
}

export function RubifuriSettingsPanel() {
    let [configuration, setConfiguration] = useState<RubifuriConfiguration>({
        name: "",
        language: "en",
        yahoo_apiKey: false,
        unsplash_apiKey: false
    });
    let [configurationSaveStatus, setConfigurationSaveStatus] = useState<boolean | "error">(true);
    let [configurationLoaded, setConfigurationLoaded] = useState<boolean | "error">(false);

    let [serverState, setServerState] = useState<boolean | undefined>(undefined);

    let runOnce = useRef<boolean>(false);

    function refreshConfigSetState() {
        checkConfigurationValues()
        .then((config) => {
            setConfiguration(config);
            setConfigurationLoaded(true);
        })
        .catch((error) => {
            setConfigurationLoaded("error");
            throw error;
        });
    }

    useEffect(() => {
        if (runOnce.current === true) { return; }
        runOnce.current = true;
        console.log("Running...");
        
        pingServer(setServerState);
        setInterval(() => {
            pingServer(setServerState);
        }, 2000);

        refreshConfigSetState();
    }, []);

    return (<>
        <div className="panel">
            <h1><Settings strokeWidth={2.25} />&nbsp;Settings</h1>
            <p>Change the settings for Rubifuri from here. The settings are saved to your device and are not linked to any account or authentication system.</p>

            <div className="row">
                <div className="status" data-type={serverState === true ? "good" : serverState === false ? "bad" : ""}>
                    {serverState === true ? <>
                        <p><Server height={14} strokeWidth={2.5} />&nbsp;Server is active!</p>
                    </> : serverState === false ? <>
                        <p><ServerCrash height={14} strokeWidth={2.5} />&nbsp;Server is not active.</p>
                    </> : <>
                        <span className="loader" data-type="inline" /><p>&nbsp;Attempting to <code>fetch()</code>...</p>
                    </>}
                </div>
                <div className="status" data-type={configurationSaveStatus === true ? "good" : configurationSaveStatus === false ? "" : "bad"}>
                    {configurationSaveStatus === true ? <>
                        <p><CheckCheck height={14} strokeWidth={2.5} />&nbsp;Saved!</p>
                    </> : configurationSaveStatus === false ? <>
                        <span className="loader" data-type="inline" /><p>&nbsp;Saving...</p>
                    </> : <>
                        <p><CircleSlash height={14} strokeWidth={2.5} />&nbsp;Save Errored</p>
                    </>}
                </div>
            </div>

            {configurationLoaded ? <>
                <div className="notice" style={{borderLeftColor: "var(--fawn)"}}>
                    <p><b>Security and Backends</b></p>
                    <p>You might have noticed that when you run <code>npm run view</code>, the code spins up a backend. This backend allows for secure storage of your secrets on-device. Please be aware that <i>once you enter the secret, you will not be able to view it using this page again.</i></p>
                </div>


                <p><b>Yahoo!デベロッパーネットワーク Client ID</b></p>
                <p>The Client ID will be used for making server-to-server requests to Yahoo!'s ルビ振り API. If not supplied, the local server will refuse to make any requests and the interface will return an error suggesting that you supply a valid Client ID.</p>
                <p>You have {!configuration.yahoo_apiKey ? <><b>not set</b> a Yahoo!デベロッパーネットワーク Client ID</> : <><b>already set</b> a Yahoo!デベロッパーネットワーク Client ID that will be used to make requests</>}.</p>
                <input onChange={async (event) => {
                    setConfigurationSaveStatus(false);
                    try {
                        await makeConfigurationChange("yahoo_apiKey", event.target.value);
                        refreshConfigSetState();
                    } catch {
                        setConfigurationSaveStatus("error");
                        return;
                    }
                    setConfigurationSaveStatus(true);
                }} type="password" placeholder="Enter your Yahoo! Client ID..."></input>

                <p><b>Unsplash API Key</b></p>
                <p>As Rubifuri supports Unsplash based backgrounds, Rubifuri will ask Unsplash for a new, random, Japan-based background every day. Rubifuri makes only one request per day, saving on API credits.</p>
                <p>You have {!configuration.unsplash_apiKey ? <><b>not set</b> an Unsplash API Key</> : <><b>already set</b> an Unsplash API Key that will be used to show backgrounds</>}.</p>
                <input onChange={async (event) => {
                    setConfigurationSaveStatus(false);
                    try {
                        await makeConfigurationChange("unsplash_apiKey", event.target.value);
                        refreshConfigSetState();
                    } catch {
                        setConfigurationSaveStatus("error");
                        return;
                    }
                    setConfigurationSaveStatus(true);
                }} type="password" placeholder="Enter your Unsplash API Key..."></input>

                <p><b>Name</b></p>
                <p>Rubifuri, if needed, will refer to you by this name.</p>
                <input onChange={async (event) => {
                    setConfigurationSaveStatus(false);
                    try {
                        refreshConfigSetState();
                        await makeConfigurationChange("name", event.target.value);
                    } catch {
                        setConfigurationSaveStatus("error");
                        return;
                    }
                    setConfigurationSaveStatus(true);
                }} type="text" placeholder="Enter your name..."></input>
            </> : configurationLoaded == false ? <>
                <h2 style={{marginLeft: "auto", marginRight: "auto", marginTop: "24px"}}><span className="loader" data-type="header" />&nbsp;Checking for your settings...</h2>
            </> : <>
                <h2 style={{color: "var(--red)", marginLeft: "auto", marginRight: "auto", marginTop: "24px"}}><Ban />&nbsp;Failed to load settings. Please clear site data and retry.</h2>
            </>}
        </div>
    </>)
}
