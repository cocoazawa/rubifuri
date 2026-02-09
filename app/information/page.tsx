// page.tsx
//
// Copyright (C) 2026 cocoazawa

"use client"

import { BookA, ImageDown, Server, ServerCrash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getBackgroundThroughBackend, pingServer } from "@/app/utilities";


export function GitHubLogo({height}: {height: number}) {
    return(<svg width={(416/95) * height} height={height} viewBox="0 0 416 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_730_27128)">
                    <path d="M41.6394 69.3848C29.0066 67.8535 20.1062 58.7617 20.1062 46.9902C20.1062 42.2051 21.8289 37.0371 24.7 33.5918C23.4558 30.4336 23.6472 23.7344 25.0828 20.959C28.9109 20.4805 34.0789 22.4902 37.1414 25.2656C40.7781 24.1172 44.6062 23.543 49.2957 23.543C53.9851 23.543 57.8132 24.1172 61.2585 25.1699C64.2253 22.4902 69.489 20.4805 73.3171 20.959C74.657 23.543 74.8484 30.2422 73.6042 33.4961C76.6667 37.1328 78.2937 42.0137 78.2937 46.9902C78.2937 58.7617 69.3933 67.6621 56.5691 69.2891C59.823 71.3945 62.0242 75.9883 62.0242 81.252L62.0242 91.2051C62.0242 94.0762 64.4167 95.7031 67.2878 94.5547C84.6101 87.9512 98.2 70.6289 98.2 49.1914C98.2 22.1074 76.1882 6.69539e-07 49.1042 4.309e-07C22.0203 1.92261e-07 0.199951 22.1074 0.199951 49.1914C0.199951 70.4375 13.6941 88.0469 31.8777 94.6504C34.4617 95.6074 36.95 93.8848 36.95 91.3008L36.95 83.6445C35.6101 84.2188 33.8875 84.6016 32.3562 84.6016C26.0398 84.6016 22.3074 81.1563 19.6277 74.7441C18.575 72.1602 17.4265 70.6289 15.2253 70.3418C14.0769 70.2461 13.6941 69.7676 13.6941 69.1934C13.6941 68.0449 15.6082 67.1836 17.5222 67.1836C20.2976 67.1836 22.6902 68.9063 25.1785 72.4473C27.0925 75.2227 29.1023 76.4668 31.4949 76.4668C33.8875 76.4668 35.4187 75.6055 37.6199 73.4043C39.2468 71.7773 40.491 70.3418 41.6394 69.3848Z" fill="black" />
                    <g clipPath="url(#clip1_730_27128)">
                        <path d="M188.937 83.0045L188.937 33.2827L202.915 33.2827L202.915 83.0045L188.937 83.0045ZM230.016 83.0045C220.727 83.0045 217.099 79.0232 217.099 70.6183L217.099 44.9611L208.252 44.9611L208.252 33.2827L217.099 33.2827L217.099 23.3737L231.078 20.1002L231.078 33.2827L241.429 33.2827L241.429 44.9611L231.078 44.9611L231.078 67.5217C231.078 70.2644 232.317 71.3261 235.059 71.3261L241.429 71.3261L241.429 83.0045L230.016 83.0045ZM327.47 83.8892C316.588 83.8892 310.66 77.8731 310.66 66.9024L310.66 33.2827L324.728 33.2827L324.728 63.1866C324.728 69.2912 327.47 72.6532 332.69 72.6532C338.706 72.6532 343.307 67.0794 343.307 59.4707L343.307 33.2827L357.374 33.2827L357.374 83.0045L343.307 83.0045L343.307 74.5996C340.653 79.9964 334.283 83.8892 327.47 83.8892ZM394.613 83.8892C387.832 83.8892 381.639 79.9964 378.687 74.4226L378.687 83.0045L364.709 83.0045L364.709 13.6417L378.776 13.6417L378.776 42.3954C381.639 36.3792 388.098 32.1325 394.613 32.1325C408.181 32.1325 415.348 41.5107 414.873 58.0551C415.348 74.4226 407.916 83.8892 394.613 83.8892ZM389.658 72.1223C396.945 72.1223 400.926 66.7255 400.452 58.0551C400.926 49.2963 396.945 43.8994 389.658 43.8994C383.851 43.8994 379.251 49.5617 378.776 57.3473L378.776 58.1436C379.251 66.1946 383.851 72.1223 389.658 72.1223ZM288.734 13.6417L288.734 41.7761L262.369 41.7761L262.369 13.6417L247.329 13.6417L247.329 83.0045L262.369 83.0045L262.369 55.224L288.734 55.224L288.734 83.0045L303.775 83.0045L303.775 13.6417L288.734 13.6417ZM150.628 84.3316C130.102 84.3316 117.185 70.2644 117.185 48.2346C117.185 26.2048 130.368 12.3146 151.247 12.3146C168.234 12.3146 178.497 19.5693 181.77 31.7786L166.553 35.406C164.695 28.7705 159.387 25.1431 151.247 25.1431C139.126 25.1431 132.579 33.1057 132.579 48.2346C132.579 63.3635 138.949 71.503 150.893 71.503C161.864 71.503 168.411 64.7791 168.411 53.366L168.411 50.7119L172.304 56.1087L149.655 56.1087L149.655 43.3686L183.628 43.3686L183.628 51.4196C183.628 72.5647 171.331 84.3316 150.628 84.3316ZM195.926 28.5936C200.615 28.5936 204.243 24.9662 204.243 20.2771C204.243 15.5881 200.615 11.9607 195.926 11.9607C191.237 11.9607 187.61 15.5881 187.61 20.2771C187.61 24.9662 191.237 28.5936 195.926 28.5936Z" fill="black" />
                    </g>
                </g>
                <defs>
                    <clipPath id="clip0_730_27128">
                        <rect width="416" height="95" fill="white" />
                    </clipPath>
                    <clipPath id="clip1_730_27128">
                        <rect width="298.068" height="75.9408" fill="white" transform="translate(117.185 9.49258)" />
                    </clipPath>
                </defs>
            </svg>)
}

export default function RubifuriInformationPanel() {
    let [serverState, setServerState] = useState<boolean | undefined>(undefined);

    let [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
    let imageRef = useRef<HTMLImageElement>(null);

    let runOnce = useRef<boolean>(false);

    useEffect(() => {
        if (runOnce.current === true || imageRef.current === null) { return; }
        runOnce.current = true;

        pingServer(setServerState);
        setInterval(() => {
            pingServer(setServerState);
        }, 2000);

        imageRef.current.addEventListener("load", (event) => {
            imageRef.current!.classList.add("loaded");
        })
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

            <button onClick={(event) => {
                getBackgroundThroughBackend()
                .then((value) => {
                    setImageSrc(value);
                })
            }}><ImageDown height={14} strokeWidth={2.25} />&nbsp;Test Upcoming Image Functionality</button>

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
        <img ref={imageRef} src={imageSrc} className="background"></img>
    </>)
}
