'use client'
import type { NextPage } from "next";
import Image from "next/image";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
// Not using icons for now
// import { MdOutlineClose } from "react-icons/md";
// import { HiLightningBolt } from "react-icons/hi";

import { projectId, wagmi_config } from "@/wagmiconfig";
import { useAccount, useSignMessage, useAccountEffect } from "wagmi";

import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";

import AuthClient, { generateNonce } from "@walletconnect/auth-client";

import ConnectButton from "@/components/ConnectButton";
import CustomButton from "@/components/CustomButton";
// Toast styling (not using for now)
// import styles from "./styles.module.css";
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
    config: wagmi_config,
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
  // uri message string directly comes into provider 
  // const [uristring, setUriString] = useState<string>("");


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

  // If we have address available, user has connected
  useEffect(() => {
    if (address) {
      if (open) { // If web3modal is open, close it because we already have address
        close();  // next would be signing a message to subscribe to badgefactory
      }
      changeView("signedIn");
    }
  }, [address, changeView, open, close]);

  useEffect(() => {
    if (wagmiaddress) {
      setAddress(wagmiaddress);
    }
  }, [wagmiaddress, setAddress]);

  const { signMessage } = useSignMessage({ config: wagmi_config })
  
  // SignRequest will be performed here, the message will be shown
  // to the user that has following details
  // aud | domain | chainId | type | nonce | statement
  // statement will change based on subscribed as customer or entity
  const perform_sign_request = async (signed_message: string) => {
    let uristring_internal = "";
    await client?.request({
      aud: window.location.href,
      domain: window.location.hostname.split(".").slice(-2).join("."),
      chainId: "eip155:2710",
      type: "eip4361",
      nonce: generateNonce(),
      statement: signed_message
    }).then(({ uri }) => {
      if (uri) {
        uristring_internal = uri
      }
    });
    // Once we have the format to be signed, send that to
    // the wallet, currently it's in wc form, it should display all details
    // of what is being signed here @todo
    client?.core.pairing.pair({ uri: uristring_internal });
        signMessage({
          account: `0x${address.substring(2)}`,
          message: uristring_internal
        }, {
          onSuccess(data, variables, context) {
            console.log("Successfully signed")
            // console.log("AUTH RESPONSE ARRIVED");
            // Doesn't work @todo
            // const sendnotif = () => toast("Subscribed to BadgeFactory.");
            // sendnotif();
          },
          onError(error, variables, context) {
            console.error(error);
            const sendnotif = () => toast(`Error Occurred:\n${error.message}`);
            sendnotif();
          },
          onSettled(data, error, variables, context) {
            const sendnotif = () => toast("Subscribed to BadgeFactory.");
            sendnotif();
            console.log("It has settled");  // probably for tx
            // Transfer user to their respective locations
          },
        })
  }

  // Dont react to any other hooks. Only react to reception of uristring 
  // When we have the uri string, then initiate signing request and open 
  // current connector for signature (metamark, any other wallet)
  // const onSignMessage = useEffectEvent(clickedevent => {
  //   if(!client) return;
  //   // If we have client, prepare a signature here
  //   // define signed message here
  //   let whoSignedIn = "customer";
  //   let signed_message = "";
  //   if(whoSignedIn == "customer") {
  //     signed_message = "Customer Signin to BadgeFactory with Wallet.";
  //   } else if (whoSignedIn == "entity") {
  //     signed_message = "Entity Signin to BadgeFactory with Wallet.";
  //   }
    
  //   perform_sign_request(signed_message);
  // });

  const onSignMessage = (clickedevent: string) => {
    if(!client) return;
    // If we have client, prepare a signature here
    // define signed message here
    let signed_message = "";
    if(clickedevent == "customer") {
      signed_message = "Customer Signin to BadgeFactory with Wallet.";
    } else if (clickedevent == "entity") {
      signed_message = "Entity Signin to BadgeFactory with Wallet.";
    }
    
    perform_sign_request(signed_message);
  };

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
              <CustomButton user_address={address} onCustSignin={onSignMessage} onEntitySignin={onSignMessage} />
            </>
          )
        }
      </main>
      <Toaster />
    </>
  );
}

export default Home;