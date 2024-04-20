'use client'
import type { NextPage } from "next";
import Image from "next/image";

import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineClose } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";

import { projectId, wagmi_config } from "@/wagmiconfig";
import { useAccount, useSignMessage, useAccountEffect } from "wagmi";

import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";

import AuthClient, { generateNonce } from "@walletconnect/auth-client";

import ConnectButton from "@/components/ConnectButton";
import CustomButton from "@/components/CustomButton";
// Toast styling
import styles from "./styles.module.css";
// Auth client

// Base idea for landing page and user views. 
// Based on user's authentication stage, decide which view to show
// If user wallet is not connected, show modalview open({ view: "connect" })
// If user wallet is connected, but haven't signed a message, open sign message view
// If user connects and they've already signed, redirect to either /customer or /entity
//  based on their role. This happens via contract interaction, we check if customer type
//  isEntity or isCustomer and then decide
// Validate we have a project id
if (!projectId) throw new Error("Wagmi config is needed for entry page");
// Modal is already processed by layout

const Home: NextPage = ({ }) => {
  // Validate mount state?
  // verify mount state to match states between clientside and serverside
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, [])

  // Return null if we haven't mounted yet
  //if (!hasMounted) return null;
  // Too many hooks here for this to work correctly

  // decide based on these state vars what view should be displayed
  // view1 - connect wallet
  // view2 - sign message / subscribe as customer or entity
  // view3 - their respective dashboards
  // const [client, setClient] = useState(AuthClient | null)();

  // auth client
  const [client, setClient] = useState<AuthClient | null>();
  // const [hasInitd, setHasInitd] = useState<boolean>(false);

  // we need to check view, what view do we need to present to the user?
  // Default view if always set first
  const [view, changeView] = useState<"default" | "qr" | "signedIn">("default");
  // Have a hook on onAccountsChanged 
  useAccountEffect({
    onConnect(data) {
      console.log("User Wallet Connected", data);
    },
    onDisconnect() {
      // Change view back to default on disconnect
      changeView("default");
      // console.log("Disconnected");
    }
  })
  // address?
  const { address: wagmiaddress } = useAccount();
  // Also need web3 modal, we have that created somewhere by parent, so use hook
  const { /*open,*/ close } = useWeb3Modal();
  // check current modal state
  const { open } = useWeb3ModalState();

  // Address is also a state var
  const [address, setAddress] = useState<string>("");

  // URI of signing a message
  const [uristring, setUriString] = useState<string>("");

  // What happens when signin happens
  const onCustomerSignIn = useCallback(() => {
    // auth client needed here
    if (!client) return;

    client.request({
      aud: window.location.href,
      domain: window.location.hostname.split(".").slice(-2).join("."),
      chainId: "eip155:2710",
      type: "eip4361",
      nonce: generateNonce(),
      statement: "Customer Signin to BadgeFactory with Wallet."
    }).then(({ uri }) => {
      if (uri) {
        // receive signdata
        setUriString(uri);
      }
    });
  }, [client, setUriString]);

  const onEntitySignIn = useCallback(() => {
    // auth client needed here
    if (!client) return;

    // Prepare the message to sign (MorphL2 signature only)
    // const iss = `did:pkh:eip155:2710:${address}`;
    // const me
    client.request({
      aud: window.location.href,
      domain: window.location.hostname.split(".").slice(-2).join("."),
      chainId: "eip155:2710",
      type: "eip4361",
      nonce: generateNonce(),
      statement: "Entity Signin to BadgeFactory with Wallet."
    }).then(({ uri }) => {
      if (uri) {
        setUriString(uri);
      }
    });
  }, [client, setUriString]);


  // Check auth client init
  useEffect(() => {
    AuthClient.init({
      relayUrl: process.env.NEXT_PUBLIC_RELAY_URL || "wss://relay.walletconnect.com",
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECTID!,
      metadata: {
        name: "BadgeFactory",
        description: "Unified platform for loyalty management system, on a mission to create globally interlinked loyalty network .0",
        url: "https://badgefactory.dotzerolabs.com/",
        icons: ["https://badgefactory.dotzerolabs.com/favicon.ico"]
      }
    }).then((authClient) => {
      setClient(authClient);
    }).catch((error) => {
      console.log("Error OCcurred at Authclient");
      console.log(error);
    });
  }, []);

  useEffect(() => {
    if (!client) return; // We need auth client
    client.on("auth_response", ({ params }) => {
      console.log("AUTH RESPONSE ARRIVED");
      if ("code" in params) {
        console.error(params);
        return close();
      }

      // IF any errors
      if ("error" in params) {
        console.error(params.error);
        if ("message" in params.error) {
          const error_message = () =>
            toast.custom(
              (t) => (
                <div>
                  <div className={styles.iconWrapper}>
                    <HiLightningBolt />
                  </div>
                  <div className={styles.contentWrapper}>
                    <h1>An Error Occurred</h1>
                    <p> {params.error.message} </p>
                  </div>
                  <div className={styles.closeIcon} onClick={() => toast.dismiss(t.id)}>
                    <MdOutlineClose />
                  </div>
                </div>
              ),
              { id: "unique-notification", position: "bottom-right" }
            );
          // show toast
          error_message();
        };

        // close the modal
        return close();
      }

      // If no errors - sign in successful 
      // initially toast would be - className={/*t.visible ? "top-0" : "-top-96"*/}
      // const success_auth = () => toast.custom(
      //   (t) => (
      //     <div>
      //       <div className={styles.iconWrapper}>
      //         <HiLightningBolt />
      //       </div>
      //       <div className={styles.contentWrapper}>
      //         <h1>Auth Request Successful</h1>
      //         <p> Auth request has completed succesfully. </p>
      //       </div>
      //       <div className={styles.closeIcon} onClick={() => toast.dismiss(t.id)}>
      //         <MdOutlineClose />
      //       </div>
      //     </div>
      //   ),
      //   { id: "unique-notification", position: "top-center" }
      // );
      // // show toast
      // success_auth();
      const sendnotif = () => toast("Subscribed to BadgeFactory.");
      sendnotif();
      // setAddress(params.result.p.iss.split(":")[4]);
      // This should also register on BadgeFactory as signature for subscription
    })
  }, [client]);

  // If we have address available, user has connected
  useEffect(() => {
    if (address) {
      if (open) { // If web3modal is open, close it because we already have address
        close();  // next would be signing a message to subscribe to badgefactory
      }
      changeView("signedIn");
    }
  }, [address, changeView, open]);

  useEffect(() => {
    if (wagmiaddress) {
      setAddress(wagmiaddress);
    }
  }, [wagmiaddress, setAddress]);

  const { signMessage } = useSignMessage()
  // When uri received
  useEffect(() => {
    async function handleOpenModal() {
      if (uristring) {
        client?.core.pairing.pair({ uri: uristring });
        await signMessage({
          account: `0x${address.substring(2)}`,
          message: uristring
        }, {
          onSuccess(data, variables, context) {
            console.log("Successfully signed")
          },
          onError(error, variables, context) {
            console.log("Signing error occurred")
          },
          onSettled(data, error, variables, context) {
            console.log("It has settled");  // probably for tx
          },
        })
      }
    }
    handleOpenModal();
  }, [uristring, wagmi_config, client, address]);

  return (
    <>
      <main className="flex w-full min-h-fit flex-col items-center justify-between p-24 content-center">
        <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/BadgeFactory.svg"
            alt="BadgeFactory_textlogo"
            width={548}
            height={126}
            priority
          />
        </div>
        <br /><br />
        <br /><br />
        <button onClick={
          () => {
            toast("Hello World from Badgefactory")
          }
        }>Notify me</button>
        {
          view === "default" && (
            <>
              <ConnectButton />
            </>
          )
        }
        {
          view === "signedIn" && (
            <>
              <CustomButton user_address={address} onCustSignin={onCustomerSignIn} onEntitySignin={onEntitySignIn} />
            </>
          )
        }
      </main>
      <Toaster />
    </>
  );
}

export default Home;