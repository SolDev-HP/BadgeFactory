import { wagmi_config } from "@/wagmiconfig";
import { headers } from "next/headers";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import "./globals.css";
import { Suspense } from "react";
import ContextProvider from "@/context";



// const projectId = process.env.WALLET_CONNECT_PROJECTID;
// // Validate projectid is set
// //// IF we don't have projectID, throw error and indicate
// if (!projectId) throw new Error("WalletConnect ProjectID needed");

// //// BadgeFactory project details
// //// Once I deploy badgefactory on vercel, I can redirect it to dotzero labs subdomain
// //// As I own dotzerolabs.com, it should be straight-forward to have that subdomain and vercel deployment
// //// interact the way I want them to
// export const metadata = {
//   name: "BadgeFactory",
//   description: "Unified platform for loyalty management system, on a mission to create globally interlinked loyalty network .0",
//   url: "https://badgefactory.dotzerolabs.com/",
//   icons: ["https://badgefactory.dotzerolabs.com/favicon.ico"]
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read initial state from the cookie sent, if it's not present, new will be created
  const initialState = cookieToInitialState(wagmi_config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className="w-full min-h-screen content-center h-screen flex items-center">
        <ContextProvider initialState={initialState}>{children}</ContextProvider>
      </body>
    </html>
  );
}
