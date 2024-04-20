// Use nextjs auth for message signing 

import { NextApiRequest, NextApiResponse } from "next";
import credentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import nextAuth from "next-auth";
import type { SIWESession } from "@web3modal/siwe";
import { SiweMessage } from "siwe";
import { ethers } from "ethers";


// by-default we have this session var, with address and chainId
// By this I can just use session and get address is user is already logged in
// on given chainid, and user role may be? @todo
// Own own session object for the user that uses BadgeFactory
declare module 'next-auth' {
    interface Session extends SIWESession {
        address: string
        chainId: number
        userrole: string
    }
}

// Min BadgeFactory abi to access isEntity and isCustomer
// This will later move into /constants/xyz
const min_badgefactory_abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "check_user_role",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "_role",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

// This will be session that is going to be used in nextAuth obj creation
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    if (!nextAuthSecret) throw new Error("NextAuth not set");

    // Validate projectid
    const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECTID;
    if (!projectId) throw new Error("Wagmi ProjectID not set");

    // Get MorphL2 RPC from env vars
    const ml2_rpc = process.env.NEXT_PUBLIC_MORPHL2_RPC;
    // RPC is required for auth
    if (!ml2_rpc) throw new Error("MorphL2 RPC not set");

    // Get BadgeFactory deployment address morphl2 sepolia
    const ml2_badgefactory_address = process.env.NEXT_PUBLIC_BADGEFACTORY_MORPHL2_ADDRESS;
    if (!ml2_badgefactory_address) throw new Error("BadgeFactory morphl2 address not set");
    console.log("Coming up to auth ----------------")
    // credentials provider setup - wallet connect wagmi
    const providers = [
        credentialsProvider({
            name: 'mSepolia',
            credentials: {
                message: {
                    label: "Message",
                    type: "text",
                    placeholder: "0x0",
                },
                signature: {
                    label: "Signature",
                    type: "text",
                    placeholder: "0x0",
                }
            },
            // How user should be authorized to use badgefactory
            async authorize(credentials) {
                // If we don't have creds, throw? @todo for now just return null sess
                if (!credentials) return null;

                // Check user address on BadgeFactory contract
                const ml2_provider = new ethers.JsonRpcProvider(ml2_rpc)
                // get BadgeFactory contract
                const badgefactory_contract = new ethers.Contract(ml2_badgefactory_address, min_badgefactory_abi, ml2_provider);

                // userroles, 0 not reg, 1 entity, 2 customer
                // entity can be a customer, but rolecheck prioritises being entity @todo maybe fix this later

                try {
                    if (!credentials?.message) {
                        throw new Error("Sign-In-With-Eth Message not set");
                    }

                    const siwe = new SiweMessage(credentials.message);
                    const userrole = await badgefactory_contract.check_user_role(siwe.address);
                    // GetCurrentDate, add 1 day and set session expiry to 1 day

                    // If already done
                    if (Number(userrole) !== 0) {
                        // already done
                        return {
                            id: `eip155:${siwe.chainId}:${siwe.address}:${Number(userrole)}`
                        };
                    }

                    // If here, user hasn't subscribed yet, then then should be here
                    const provider = new ethers.JsonRpcProvider(
                        `https://rpc.walletconnect.com/v1?chainId=eip155:${siwe.chainId}&projectId=${projectId}`
                    );

                    // Get nonce
                    const nonce = await getCsrfToken({ req: { headers: req.headers } });
                    // Validate result
                    const result = await siwe.verify(
                        {
                            signature: credentials?.signature || '',
                            nonce
                        },
                        { provider }
                    );

                    if (result.success) {
                        return {
                            id: `eip155:${siwe.chainId}:${siwe.address}:${Number(userrole)}`
                        }
                    }

                    // else return null to indicate not authenticated
                    return null
                } catch (error) {
                    // What kind of error happened here
                    console.error(error);
                    return null
                }
            }

        })
    ];

    // Default signing page
    const isSubscribePage = req.method == 'GET' && req.query?.['nextauth']?.includes("/subscribe");

    // SIWE on subscribepage only
    if (!isSubscribePage) {
        // Remove eth provider we just added
        // use default connect + create next auth session 
        // and then come back to this from /subscribe page
        providers.pop();
        console.log("Provider removed ------")
    }

    return await nextAuth(req, res, {
        // Nextauth jwt start
        secret: nextAuthSecret,
        providers,
        session: {
            strategy: "jwt",
            maxAge: 24 * 60 * 60 // 24 hours maxage for auth token
        },
        callbacks: {
            session({ session, token }) {
                if (!token.sub) {
                    console.log("No Auth Token");
                    return session;
                }

                const [, chainId, address, userrole] = token.sub.split(":")
                if (chainId && address && userrole) {
                    session.address = address;
                    session.chainId = parseInt(chainId, 10);
                    session.userrole = userrole;             // I've added this into Session interface above
                }

                return session;
            }
        }
    })
}