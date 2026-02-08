// definitions.ts
//
// Copyright (C) 2026 cocoazawa



export const HostPortNumber: number = 6226;
export const HandlerPortNumber: number = 62263;


// yanked from https://developer.yahoo.co.jp/webapi/jlp/furigana/v2/furigana.html#:~:text=%E3%83%AC%E3%82%B9%E3%83%9D%E3%83%B3%E3%82%B9%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB%E3%83%89
// the URL looks so long due to Japanese encodeURIComponent. It's just the documentation for the Yahoo API.
export interface YahooResponse {
    id: string | number,
    jsonrpc: "2.0",
    result: {
        word: Array<{
            surface: string,
            furigana: string,
            roman: string,
            subword: Array<{
                surface: string,
                furigana: string,
                roman: string
            }>
        }>
    }
}


// types of requests RubifuriServe accepts
type RubifuriServeAccept = "authentication" | "rubifuri" | "unsplash" | "ping";

// server request document (frontend-backend transmissions)
export interface RubifuriServerRequest {
    for: RubifuriServeAccept;
    input: string;
}
// server response document (frontend-backend transmissions)
export interface RubifuriServerResponse {
    status: "success" | "error";
    statusCode: number;
    for: RubifuriServeAccept;
    errorMessage?: string;
    output: any;
}

export interface RubifuriConversion_ResponseObject {
    flattened: string;
    actual: YahooResponse;
}
export interface RubifuriAuthentication_RequestObject {
    purpose: "check" | "set";
    key: string;
    value: string;
}
export interface RubifuriAuthentication_CheckResponseObject {
    key: string;
    valueIsSet: boolean;
}


