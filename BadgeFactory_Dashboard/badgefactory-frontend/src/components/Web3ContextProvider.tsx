// A component for wagmi context provider
// this context will change depending upon useAccount() changes
'use client'

import React, { ReactNode } from 'react';
import { config } from "dotenv";
import { wagmi_config, projectId } from '@/app/wagmiconfig/wagmi_config';
// For the web3 modal that allows wallet connection
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Wagmi provider 
import { State, WagmiProvider } from 'wagmi';

// QueryClient, can be persistent if needed but I'll explore that later
const queryClient = new QueryClient();
// Validate projectid is set
if (!projectId) throw new Error("ProjectID not set for WalletConnect");

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