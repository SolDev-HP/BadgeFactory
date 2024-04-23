// Entity dashboard route
// If logged in user is subscribed as 
import Image from "next/image";
import styles from "./styles.module.css";
// Same as Customer, it should validate session
import { getSession, useSession } from "next-auth/react";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";


export default async function Entity() {
    // Get session
    // This goes into components - sub components here 
    // const { status } = useSession({
    //     required: true,
    //     onUnauthenticated() {
    //         console.log("Entity has logged out, regroup and redirect");
    //     },
    // })
    
    // // If status is loading
    // // it can only be loading/authenticated due to required:true param we passed
    // if(status === "loading") {
    //     return (<Suspense fallback={<>Loading...</>}></Suspense>);
    // }
    // Else show data
    const session = await getSession();
    return (
        <>
        {/* <SessionProvider session={session}> */}
            <main className="flex w-full min-h-fit flex-col items-center justify-between p-24 content-center">
                <div className={styles.imagecontainer}>
                    <Image
                        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                        src="/BadgeFactory.svg"
                        alt="BadgeFactory Subscription"
                        width={548}
                        height={126}
                        priority
                    />
                </div>
                <br />
                <h3>This is Entity Dashboard</h3>
            </main>
        {/* </SessionProvider> */}
        </>
    );
}

// Entity.auth = {
//     role: "entity",
//     //loading: //create a new element here @todo make loading skeletons
//     unauthorized: "/",  // unauthorized redirect to home
// }