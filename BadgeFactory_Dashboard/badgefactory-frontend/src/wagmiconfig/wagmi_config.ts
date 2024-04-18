// Config file for the wagmi provider
// Supported Eth-Sepolia and MorphL2-sepolia testnets
// Not used for now
import { http, createConfig } from "wagmi";
import { sepolia, morphSepolia } from "viem/chains";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
// import { config } from "dotenv";

// config();
//// WalletConnect projectID needed to use their connector in wagmi
//// I will mostly use WalletConnect button, and Network change-add-update 
export const projectId = process.env.WALLET_CONNECT_PROJECTID as string || "loading"; 
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