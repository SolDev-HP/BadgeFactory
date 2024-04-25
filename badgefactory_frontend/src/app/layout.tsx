import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Web3Context from "@/web3context";
import { cookieToInitialState } from "wagmi";
import { wagmiconfig } from "@/config/wagmiconfig";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

// Project metadata on main layout
export const metadata: Metadata = {
  title: "BadgeFactory",
  description:
    "Unified platform for loyalty management system, on a mission to create globally interlinked loyalty network .0",
  icons: ["http://localhost:3000/favicon.ico"], //@todo change this on prod
};

// Get initialstate and pass it to web3context

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get initial state from the cookie, if any
  const initialState = cookieToInitialState(wagmiconfig, headers().get("cookie"));

  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Context initialState={initialState}>
          <Navbar>
            {children}
          </Navbar>
        </Web3Context>
      </body>
    </html>
  );
}
