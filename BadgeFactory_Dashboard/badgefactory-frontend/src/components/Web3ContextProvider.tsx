// A component for wagmi context provider
// this context will change depending upon useAccount() changes
'use client'

import React, { ReactNode } from 'react';
import { config } from "dotenv";
// import { wagmi_config } from '@/wagmiconfig/wagmi_config';
import { sepolia, morphSepolia } from "viem/chains";
// For the web3 modal that allows wallet connection
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Wagmi provider 
import { State, WagmiProvider } from 'wagmi';
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";


// QueryClient, can be persistent if needed but I'll explore that later
const queryClient = new QueryClient();
const projectId = process.env.WALLET_CONNECT_PROJECTID as string || "loading";
// Validate projectid is set
// if (!projectId) throw new Error("ProjectID not set for WalletConnect");
//// IF we don't have projectID, throw error and indicate
//if(!projectId) throw new Error("WalletConnect ProjectID needed");

//// BadgeFactory project details
//// Once I deploy badgefactory on vercel, I can redirect it to dotzero labs subdomain
//// As I own dotzerolabs.com, it should be straight-forward to have that subdomain and vercel deployment
//// interact the way I want them to
const metadata = {
    name: "BadgeFactory",
    description: "Unified platform for loyalty management system, on a mission to create globally interlinked loyalty network .0",
    url: "https://badgefactory.dotzerolabs.com",
    icons: ["https://badgefactory.dotzerolabs.com/favicon.ico"]
}

//// Supported chains for now are eth-sepolia and morphl2-sepolia
const chains = [sepolia, morphSepolia] as const 

export const wagmi_config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage
    })
})

// Create a wagmi modal
createWeb3Modal({
    wagmiConfig: wagmi_config,
    projectId,
    enableAnalytics: true,
    enableOnramp: true
})

// Export this component, this will be used in root layout for wrapping around body contents
export default function Web3ContextProvider({
    children,
    initialState
} : {
    children: ReactNode,
    initialState?: State
}) {
    // wagmi_config is default config I have written in config/wagmi_config
    // this allows configs to be flexible, right now it uses cookie for walletconnect 
    // auth related storage
    return (
        <WagmiProvider config={wagmi_config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}