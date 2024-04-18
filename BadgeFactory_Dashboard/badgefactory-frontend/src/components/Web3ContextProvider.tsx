// A component for wagmi context provider
// this context will change depending upon useAccount() changes
'use client'

import React, { ReactNode } from 'react';
import { config } from "dotenv";
// For the web3 modal that allows wallet connection
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Wagmi provider 
import { State, WagmiProvider } from 'wagmi';

// createWeb3Modal({
//     wagmiConfig: 
// })