import type { Metadata } from "next";
import { WagmiProvider, useAccount } from "wagmi";
//import { wagmi_config } from "./wagmiconfig/wagmi_config";
import Web3ContextProvider from "@/components/Web3ContextProvider";
import { cookieToInitialState } from "wagmi";
import "./globals.css";
import { wagmi_config } from "./wagmiconfig/wagmi_config";
import { headers } from "next/headers";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "BadgeFactory",
  description: "Unified platform for loyalty management system, on a mission to create globally interlinked loyalty network .0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read initial state from the cookie sent, if it's not present, new will be created
  const initialState = cookieToInitialState(wagmi_config, headers().get('cookie'));
  return (
    <html lang="en">
      <body className="w-full min-h-screen content-center h-screen flex items-center">
        <Web3ContextProvider initialState={initialState}>
          <Suspense>
            {children}
          </Suspense>
        </Web3ContextProvider>
      </body>
    </html>
  );
}
