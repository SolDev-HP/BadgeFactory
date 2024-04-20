'use client'

import React, { ReactNode } from "react";
import { wagmi_config, projectId } from "@/wagmiconfig";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { State, WagmiProvider } from "wagmi";

// queryclient, for queryprovider 
const queryClient = new QueryClient();

// verify projectid from environment
if (!projectId) throw new Error("ProjectId is not available");
// no analytics events, may be this way we solve pulse.walletconnect error @todo not severe

createWeb3Modal({
    wagmiConfig: wagmi_config,
    projectId
})

// Prepare a wagmi context provider
// IT should simply receive initial context from layout
export default function ContextProvider({
    children,
    initialState
}: {
    children: ReactNode,
    initialState?: State
}) {
    return (
        <WagmiProvider config={wagmi_config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}