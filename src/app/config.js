import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrumSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

// Import error suppression utility
import './utils/errorSuppression';

export const wagmiConfig = getDefaultConfig({
    appName: 'Genun',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '2f5a2c1b8e4d3a9f7c6b5e8d9a2f1c4b',
    chains: [arbitrumSepolia],
    ssr: true,
    // Enhanced transport configuration with multiple RPC endpoints
    transports: {
        [arbitrumSepolia.id]: http('https://sepolia-rollup.arbitrum.io/rpc', {
            batch: false, // Disable batching to avoid RPC issues
            fetchOptions: {
                timeout: 30000, // Increase timeout
            },
            retryCount: 5, // More retries
            retryDelay: 2000, // Longer delay between retries
        })
    }
});


export const API_URL = {
    DEV_URL: (process.env.NEXT_PUBLIC_DEV_URL || 'http://localhost:3002/') + 'api/',
    PROD_URL: (process.env.NEXT_PUBLIC_PROD_URL || 'https://genun-api-1.onrender.com/') + 'api/',
}

export const POOS_FACTORY_CONRACT_ADDRESS = "0x3C78D6B9978dB83723f4Aaa0FE27100f0762A3c6"//"0xE1Fa53c9858FD7d08CFDF4335c189c94a3aA32B5" // "0xE1Fa53c9858FD7d08CFDF4335c189c94a3aA32B5"


export const FETCH_JSON_INIT = (payload = {}, method = "POST", contentType = "application/json") => {
    return {
        method: method, // *GET, POST, PUT, DELETE, etc.
        //mode: "cors", // no-cors, *cors, same-origin
        //cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": contentType,
            "x-auth-token": localStorage.getItem("_poostoken_")
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        //redirect: "follow", // manual, *follow, error
        //referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(payload)
    }
}

export const FETCH_INIT = (method = "GET") => {
    return {
        method: method, // *GET, POST, PUT, DELETE, etc.
        //mode: "cors", // no-cors, *cors, same-origin
        //cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: "same-origin", // include, *same-origin, omit
        headers: {
            //"Content-Type": contentType,
            "x-auth-token": localStorage.getItem("_poostoken_")
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    }
}

export const FETCH_FORMDATA_INIT = (formData, method = "POST") => {
    return {
        method: method, // *GET, POST, PUT, DELETE, etc.
        //mode: "cors", // no-cors, *cors, same-origin
        //cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "x-auth-token": localStorage.getItem("_poostoken_"),
            //"Content-Type": contentType,
            //'Content-Type': 'multipart/form-data',
        },
        //redirect: "follow", // manual, *follow, error
        //referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: formData
    }
}

//other configutations 