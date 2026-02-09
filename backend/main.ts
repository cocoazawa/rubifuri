// main.ts
//
// Copyright (C) 2026 cocoazawa


import { createServer } from "http";
import { RubifuriConversion_ResponseObject, YahooResponse, RubifuriServerResponse, RubifuriServerRequest, HostPortNumber, HandlerPortNumber as BackendPortNumber, RubifuriAuthentication_RequestObject } from "./definitions";
import * as cookieHandler from "cookie";

// Actually make request to Yahoo! Developer Network for Furigana
async function handleRubifuriRequest(forString: string, withKey: string): Promise<RubifuriConversion_ResponseObject> {
    const requestEndpoint = "https://jlp.yahooapis.jp/FuriganaService/V2/furigana?";
    
    const query = {
        "id": Math.round(Math.random() * 100),
        "jsonrpc": "2.0",
        "method": "jlp.furiganaservice.furigana",
        "params": {
            "q": forString,
            "grade": 1,
        }
    }
    
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("User-Agent", `Yahoo AppID: ${withKey}`);
    
    try {
        let yahooOfficialResponse: Response = await fetch(requestEndpoint, {
            mode: "no-cors",
            method: "POST",
            body: JSON.stringify(query),
            headers: headers
        });

        let yahooResponseParsed: YahooResponse = await yahooOfficialResponse.json();

        let totalWordsLength = yahooResponseParsed.result.word.length;
        let furiganaArray = [];
    
    
        for (let index = 0; index < totalWordsLength; index++) {
            const word = yahooResponseParsed.result.word[index];
    
            try {
                if (word.furigana === undefined) {
                    furiganaArray.push(word.surface);
                    continue;
                }
            } catch {
                continue;
            }
    
            furiganaArray.push(word.furigana);
        }
    
        
        return({
            flattened: furiganaArray.join(""),
            actual: yahooResponseParsed
        });
    } catch {
        throw new Error("Error while contacting the Yahoo Developer Network.");
    }
}

async function handleImageRequest(withKey: string): Promise<string> {
    const requestEndpoint = "https://api.unsplash.com/search/photos?page=1&per_page=1&query=japan%20landscape";

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Origin", "http://localhost:62263");
    headers.set("User-Agent", "RubifuriAgent v0.2");
    headers.set("User-Agent", "RubifuriAgent v0.2");
    headers.set("Authorization", "Client-ID " + withKey);
    
    try {
        let unsplashOfficialResponse: Response = await fetch(requestEndpoint, {
            headers: headers,
            method: "GET"
        });

        let unsplashResponseParsed = await unsplashOfficialResponse.json();
        
        if (unsplashResponseParsed.results[0].urls.raw === undefined || unsplashResponseParsed.results[0].urls.raw === null) { throw new Error("Unsplash response format deviates from nominal format."); }
        return(unsplashResponseParsed.results[0].urls.raw);
    } catch {
        throw new Error("Error while contacting Unsplash.");
    }
}

async function handleAuthenticationRequest(forRequest: RubifuriAuthentication_RequestObject): Promise<string> {
    let draftString = "";

    draftString = cookieHandler.stringifySetCookie({
        name: forRequest.key,
        value: forRequest.value,
        httpOnly: true,
        priority: "high",
        sameSite: "lax",
    });
    
    return draftString;
}

const endpoint = createServer((request, response) => {
    let respondingTicket: RubifuriServerResponse = {
        status: "success",
        statusCode: 200,
        for: "authentication",
        output: {}
    };

    let body: string = "";
    let bodyArray: Uint8Array[] = [];


    request.on("data", chunk => {
        bodyArray.push(chunk);
    });
    request.on('end', async () => {
        try {
            body = Buffer.concat(bodyArray).toString();
            let parsedBody = JSON.parse(body) as RubifuriServerRequest;

            let parsedCookies = cookieHandler.parse(request.headers.cookie ?? "");

            switch (parsedBody.for) {
                case "ping":
                    respondingTicket.for = "ping";
                    respondingTicket.output = ["pong"];

                    response.appendHeader("Access-Control-Allow-Origin", "http://localhost:" + HostPortNumber);
                    response.statusCode = 200;
                    response.end(JSON.stringify(respondingTicket));

                    break;
                case "authentication":
                    respondingTicket.for = "authentication";

                    let authRequest = JSON.parse(parsedBody.input) as RubifuriAuthentication_RequestObject;
                    if (authRequest.purpose === "check") {
                        respondingTicket.output = {
                            key: authRequest.key,
                            valueIsSet: parsedCookies[authRequest.key] !== undefined && parsedCookies[authRequest.key] !== ""
                        }

                        response.appendHeader("Access-Control-Allow-Origin", "http://localhost:" + HostPortNumber);
                        response.appendHeader("Access-Control-Allow-Credentials", "true");
                        response.statusCode = 200;
                        response.end(JSON.stringify(respondingTicket));
                        return;
                    }

                    handleAuthenticationRequest(authRequest)
                        .then((cookieString) => {
                            respondingTicket.output = {};
                            response.appendHeader("Access-Control-Allow-Origin", "http://localhost:" + HostPortNumber);
                            response.appendHeader("Access-Control-Allow-Credentials", "true");
                            response.appendHeader("Set-Cookie", cookieString);
                            response.statusCode = 200;
                            response.end(JSON.stringify(respondingTicket));
                        })
                        .catch((errorMessage) => {
                            console.log("FailPoint 1B", errorMessage);
                            response.appendHeader("Access-Control-Allow-Origin", "http://localhost:" + HostPortNumber);
                            response.statusCode = 500;
                            response.end(`${errorMessage}`);
                        });

                    break;
                case "rubifuri":
                    respondingTicket.for = "rubifuri";

                    if (parsedCookies.yahoo_apiKey === undefined) {
                        response.appendHeader("Access-Control-Allow-Origin", "http://localhost:" + HostPortNumber);
                        response.statusCode = 403;
                        response.end("[RubifuriServe] Request denied due to improper authorization levels.");
                        return;
                    }

                    handleRubifuriRequest(parsedBody.input, parsedCookies.yahoo_apiKey)
                        .then(furiganaResponse => {
                            respondingTicket.output = furiganaResponse;
                            response.appendHeader("Access-Control-Allow-Origin", "http://localhost:" + HostPortNumber);
                            response.appendHeader("Access-Control-Allow-Credentials", "true");
                            response.statusCode = 200;
                            response.end(JSON.stringify(respondingTicket));
                        })
                        .catch(errorMessage => {
                            console.log("FailPoint 1C", errorMessage);
                            response.appendHeader("Access-Control-Allow-Origin", "http://localhost:" + HostPortNumber);
                            response.statusCode = 500;
                            response.end(`${errorMessage}`);
                        });

                    break;
                case "unsplash":
                    respondingTicket.for = "unsplash";

                    if (parsedCookies.unsplash_apiKey === undefined) {
                        response.appendHeader("Access-Control-Allow-Origin", "http://localhost:" + HostPortNumber);
                        response.statusCode = 403;
                        response.end("[RubifuriServe] Request denied due to improper authorization levels.");
                        return;
                    }

                    handleImageRequest(parsedCookies.unsplash_apiKey)
                        .then(unsplashResponse => {
                            respondingTicket.output = unsplashResponse;
                            response.appendHeader("Access-Control-Allow-Origin", "http://localhost:" + HostPortNumber);
                            response.appendHeader("Access-Control-Allow-Credentials", "true");
                            response.statusCode = 200;
                            response.end(JSON.stringify(respondingTicket));
                        })
                        .catch(errorMessage => {
                            console.log("FailPoint 1C", errorMessage);
                            response.appendHeader("Access-Control-Allow-Origin", "http://localhost:" + HostPortNumber);
                            response.statusCode = 500;
                            response.end(`${errorMessage}`);
                        });

                    break;
                default:
                    console.log("FailPoint 2A");
                    response.appendHeader("Access-Control-Allow-Origin", "http://localhost:" + HostPortNumber);
                    response.statusCode = 404;
                    response.end(`[RubifuriServe] That endpoint does not exist.`);
            }
        } catch (errorMessage) {
            console.log("FailPoint 1A", errorMessage);
            response.appendHeader("Access-Control-Allow-Origin", "http://localhost:" + HostPortNumber);
            response.statusCode = 500;
            response.end(`${errorMessage}`);
        }
    });
    
    request.on('error', err => {
        response.appendHeader("Access-Control-Allow-Origin", "http://localhost:" + HostPortNumber);
        response.statusCode = 500;
        response.statusMessage = "An error occurred with the backend.";
        return;
    });
})

endpoint.listen(BackendPortNumber);