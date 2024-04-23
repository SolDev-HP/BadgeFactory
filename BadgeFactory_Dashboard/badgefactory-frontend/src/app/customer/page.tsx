// For now these are empty [/customer, /entity, /subscribe]
import Image from "next/image";
import styles from "./styles.module.css";
import { SessionProvider, getSession, useSession } from "next-auth/react";
import { Suspense } from "react";

export default async function Customer() {
    // Verify session
    //// This will go waaay inside components, only refresh components 
    //// that depend on the session
    // const { status } = useSession({
    //     required: true,
    //     onUnauthenticated() {
    //         console.log("User logged out, clear session happened, redirect");
    //     },
    // })

    // if (status === "loading") {
    //     return (<Suspense fallback={<> Loading ... </>}></Suspense>)
    // }
    const session = await getSession();
    return (
        <SessionProvider session={session}>
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
                <h3>This is Customer Dashboard</h3>
            </main>
        </SessionProvider>
    );
}

// Same as Entity,
// Customer.auth = {
//     role: "customer",
//     unauthorized: "/"
// }
