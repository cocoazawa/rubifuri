// page.tsx
//
// Copyright (C) 2026 cocoazawa

"use client"

import { useEffect, useRef, useState } from "react";
import { Ban, CheckCheck, CircleSlash, Server, ServerCrash, Settings } from "lucide-react";
import { RubifuriConfiguration } from "@/app/definitions";
import { checkConfigurationValues, makeConfigurationChange, pingServer } from "@/app/utilities";

export default function RubifuriSettingsPanel() {
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
                <div className="notice" style={{borderLeftColor: "var(--red)"}}>
                    <h2>Important Notice</h2>
                    <p><em><b><i>Please be aware that, once you enter the secret, you will not be able to view it using this page again.</i></b></em></p>
                    <p>You might have noticed that when you run <code>npm run view</code>, the code spins up a backend. This backend allows for secure storage of your secrets on-device in a way that persists through sessions so that you don't have to reenter it every time.</p>
                </div>

                <h2>Change Secrets</h2>

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
