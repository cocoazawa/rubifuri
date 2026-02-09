// utilities.ts
//
// Copyright (C) 2026 cocoazawa

import { RubifuriAuthentication_CheckResponseObject, RubifuriServerRequest, RubifuriServerResponse } from "@/backend/definitions";
import { Dispatch, SetStateAction } from "react";
import { RubifuriConfiguration } from "./definitions";

function isLocalStorageAvailable(){
    var test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}

export function pingServer(setAction: Dispatch<SetStateAction<boolean | undefined>>) {
    let requestingDocument: RubifuriServerRequest = {
        for: "ping",
        input: "ping"
    }

    fetch("http://localhost:62263", {
        method: "POST",
        body: JSON.stringify(requestingDocument)
    })
    .then((response) => {
        return(response.json());
    })
    .then((secondaryResponse) => {
        if ((secondaryResponse as RubifuriServerResponse).output[0] === "pong") { setAction(true); return; }
        setAction(false);
    })
    .catch((error) => {
        console.log(error);
        setAction(false);
    });
}



export async function makeConfigurationChange(attribute: "yahoo_apiKey" | "unsplash_apiKey" | "name" | "language", value: string | "en" | "jp"): Promise<void> {
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

export async function checkConfigurationValues(): Promise<RubifuriConfiguration> {
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

export async function getBackgroundThroughBackend(): Promise<string> {
    if (!isLocalStorageAvailable()) { throw new Error("[Rubifuri] LocalStorage isn't available."); }

    const pictureOfTheDay: string | null = localStorage.getItem("images.pictureOfTheDay");

    const lastDateUnparsed: string = localStorage.getItem("images.lastFetch") ?? "0";
    const lastDate = new Date(lastDateUnparsed);
    const todayDateUnparsed = new Date();
    const todayDate = new Date(todayDateUnparsed.getFullYear(), todayDateUnparsed.getMonth(), todayDateUnparsed.getDate(), 0, 0, 0, 0);

    if (lastDate < todayDate != true && pictureOfTheDay !== null) { return pictureOfTheDay; }

    let requestingDocument: RubifuriServerRequest = {
        for: "unsplash",
        input: ""
    }

    const unsplashResponse = await fetch("http://localhost:62263", {
        method: "POST",
        body: JSON.stringify(requestingDocument),
        credentials: "include"
    })
    const unsplashResponseParsed: RubifuriServerResponse = await unsplashResponse.json() as RubifuriServerResponse;
    localStorage.setItem("images.lastFetch", `${todayDateUnparsed.getTime()}`);
    localStorage.setItem("images.pictureOfTheDay", unsplashResponseParsed.output);
    return unsplashResponseParsed.output;
}