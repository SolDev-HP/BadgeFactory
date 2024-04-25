//// WagmiConfig prep for badgefactory 
//// as we gradually prepare the frontend for it

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"
import { morphSepolia, sepolia } from "viem/chains"
import { cookieStorage, createStorage } from "wagmi"

// Need
// projectId
// chains - ethSepolia, morphSepolia
// metadata about the project
// config 

// Exports from this file
// projectId, and wagmiconfig

export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECTID
if(!projectId) throw new Error("[BF-WagmiConfig] ProjectID not set")

const metadata = {
    name: "BadgeFactory",
    description: "Unified platform for loyalty management system, on a mission to create globally interlinked loyalty network .0",
    url: "https://badgefactory.dotzerolabs.com",
    icons: ["https://badgefactory.dotzerolabs.com/favicon.ico"],
}

const chains = [sepolia, morphSepolia] as const
/// create config
export const wagmiconfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage
    })
})
