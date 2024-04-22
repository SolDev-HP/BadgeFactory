// SIWE related config. Passing this to Web3modal
// so I can keep track of session everywher, and auth happens on nextjs 
import { SiweMessage } from 'siwe';
import { createSIWEConfig } from "@web3modal/siwe";
import { getCsrfToken, signIn, signOut, getSession } from 'next-auth/react';
import type { SIWECreateMessageArgs, SIWESession, SIWEVerifyMessageArgs } from "@web3modal/siwe";

// Expand SIWECreateMessageArgs - @todo
// declare module 'next-auth' {
//     interface Session extends SIWESession {
//         address: string
//         chainId: number
//         userrole: string
//     }
// }

// declare module '@web3modal/siwe' {
//     interface CreateMessageArgs extends SIWECreateMessageArgs {
//         nonce: string
//         address: string
//         chainId: number
//         userrole: string
//     }
// }

const siwe_config = createSIWEConfig({
    nonceRefetchIntervalMs: 60,
    sessionRefetchIntervalMs: 10,
    signOutOnDisconnect: true,
    signOutOnAccountChange: true,
    signOutOnNetworkChange: true,
    createMessage: ({ nonce, address, chainId }: SIWECreateMessageArgs) =>
        new SiweMessage({
            version: "1",
            domain: window.location.host,
            uri: window.location.origin,
            address,
            chainId,
            nonce,
            statement: `Subscribing to BadgeFactory with nonce: ${nonce}`
        }).prepareMessage(),
    getNonce: async () => {
        const nonce = await getCsrfToken();
        if (!nonce) {
            throw new Error("Failed to get nonce from the user")
        }

        return nonce;
    },
    getSession: async () => {
        const session = await getSession();
        if (!session) {
            throw new Error("Failed get session for user");
        }

        const { address, chainId } = session as unknown as SIWESession;

        return { address, chainId }
    },
    verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
        // How do we verify this message and signature, default way
        try {
            const success = await signIn('credentials', {
                message,
                redirect: false,
                signature,
                callbackUrl: '/entity'        // Where do we want to go from here?
            })

            return Boolean(success?.ok);
        } catch (error) {
            return false;
        }
    },
    signOut: async () => {
        try {
            await signOut({
                redirect: false
            })

            return true;
        } catch (error) {
            return false;
        }
    },
    onSignIn: (session) => {
        console.log(`This is the current session: ${session}`)
    }
})

export default siwe_config;