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


