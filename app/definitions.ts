// definitions.ts
//
// Copyright (C) 2026 cocoazawa

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
