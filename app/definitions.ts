// definitions.ts
//
// Copyright (C) 2026 cocoazawa

import { RubifuriServerRequest, RubifuriServerResponse } from "@/backend/definitions";
import { Dispatch, SetStateAction } from "react";

export interface RubifuriConfiguration {
    yahoo_apiKey: boolean;
    unsplash_apiKey: boolean;
    name: string;
    language: "en" | "jp";
}

export function isLocalStorageAvailable(){
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

