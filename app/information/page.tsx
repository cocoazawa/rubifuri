// page.tsx
//
// Copyright (C) 2026 cocoazawa

"use client"

import { BookA, Server, ServerCrash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { pingServer } from "@/app/utilities";
import { GitHubLogo } from "../views";

export default function RubifuriInformationPanel() {
    let [serverState, setServerState] = useState<boolean | undefined>(undefined);

    let runOnce = useRef<boolean>(false);

    useEffect(() => {
        if (runOnce.current === true) { return; }
        runOnce.current = true;

        pingServer(setServerState);
        setInterval(() => {
            pingServer(setServerState);
        }, 2000);
    }, [])

    return (<>
        <div className="panel">
            <h1><BookA strokeWidth={2.25} />&nbsp;Information</h1>
            <p>Information regarding Rubifuri (v0.2)</p>

            <div className="status" data-type={serverState === true ? "good" : serverState === false ? "bad" : ""}>
                {serverState === true ? <>
                    <p><Server height={14} strokeWidth={2.5} />&nbsp;Server is active!</p>
                </> : serverState === false ? <>
                    <p><ServerCrash height={14} strokeWidth={2.5} />&nbsp;Server is not active.</p>
                </> : <>
                    <span className="loader" data-type="inline" /><p>&nbsp;Attempting to <code>fetch()</code>...</p>
                </>}
            </div>

            <h2>Project Credits</h2>
            <p>rubifuri ・ v0.2 ・ Built by <a href="https://github.com/cocoazawa" target="_blank" rel="noopener noreferrer"><code>@cocoazawa</code></a></p>
            <a className="githubRefer" href="https://github.com/cocoazawa" target="_blank" rel="noopener noreferrer"><p>View this project on&nbsp;</p><GitHubLogo height={16} /><p>.</p></a>
            <p>Copyright (C) 2026 cocoazawa</p>

            <h2>External Service Usage Credits</h2>
            <p>These projects or services are integral to making this website work.</p>
            <span style={{ margin: "15px 15px 15px 15px" }}><a href="https://developer.yahoo.co.jp/sitemap/">Web Services by Yahoo! JAPAN</a></span>
            <span style={{ margin: "15px 15px 15px 15px" }}><a href="https://unsplash.com/license"><i>Credits for any and all Unsplash images are displayed at the bottom left corner of every image.</i></a></span>

            <h2>Notice of Non-Affiliation and Disclaimer</h2>
            <p>We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with the LINEヤフー株式会社 (LY Corporation), or any of its subsidiaries or its affiliates. The official Yahoo!デベロッパーネットワーク website can be found at [https://developer.yahoo.co.jp/].</p>
            <p>The names Yahoo!デベロッパーネットワーク and Yahoo! as well as related names, marks, emblems and images are registered trademarks of their respective owners.</p>
            <p>We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with GitHub, Inc., or any of its subsidiaries or its affiliates. The official GitHub website can be found at [https://github.com/].</p>
            <p>GITHUB®, the GITHUB® logo design, the INVERTOCAT logo design, OCTOCAT®, and the OCTOCAT® logo design are trademarks of GitHub, Inc., registered in the United States and other countries.</p>
        </div>
    </>)
}
