//// Web3 context provider
//// Handles initial state received from root
'use client'
/// this is client component for nextjs every time

import { projectId, wagmiconfig } from "@/config/wagmiconfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import React from "react";
import { State, WagmiProvider } from "wagmi";

if(!projectId) throw new Error("[BF-W3Context] ProjectId is not set")

// create query client
const queryClient = new QueryClient();

createWeb3Modal({
    wagmiConfig: wagmiconfig,
    projectId,
    enableAnalytics: true,
    enableOnramp: true,
})

//// create a web3 context with initial state received from root
//// that is optional, as first time it will be empty anyway
export default function Web3Context({ 
    children,
    initialState
} : { children : React.ReactNode, initialState? : State }) {
    return (
        <WagmiProvider config={wagmiconfig} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}