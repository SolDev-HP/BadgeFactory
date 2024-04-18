import type { Metadata } from "next";
import { WagmiProvider, useAccount } from "wagmi";
//import { wagmi_config } from "./wagmiconfig/wagmi_config";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BadgeFactory",
  description: "Unified platform for loyalty management system, on a mission to create globally interlinked loyalty network .0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
