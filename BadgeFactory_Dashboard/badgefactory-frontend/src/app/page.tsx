import Image from "next/image";
import ConnectButton from "@/components/ConnectButton";
import CustomButton from "@/components/CustomButton";
import type { NextPage } from "next";
import { projectId } from "@/wagmiconfig";
import { useEffect, useState } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react"


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
  // decide based on these state vars what view should be displayed
  // view1 - connect wallet
  // view2 - sign message / subscribe as customer or entity
  // view3 - their respective dashboards
  // const [client, setClient] = useState(AuthClient | null)();

  // Step1 - we need to check view, what view do we need to present to the user?
  // Default view if always set first
  const [view, changeView] = useState<"default" | "qr" | "signedIn">("default");

  // Also need web3 modal, we have that created somewhere by parent, so use hook
  const { open, close } = useWeb3Modal();

  // Address is also a state var
  const [address, setAddress] = useState<string>("");


  // If we have address available, user has connected
  useEffect(() => {
    if (address) {
      close();
      changeView("signedIn");
    }
  }, [address, changeView]);

  return (
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
            <CustomButton user_address={address} />
          </>
        )
      }
    </main>
  );
}

export default Home;