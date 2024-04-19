// User subscribes to BadgeFactory
// Possible user roles
// ID: 1 - Entity
// ID: 0/2/anything else - Customer 
// More roles and I switch to solmate/oz roles libs

// Subscribe should be a button similar to landing,
// but with a button to sign a message
// User signs a nonce with their wallet 
// Once they subscribe, according to their role they will redirect
// towards their respective dashboards
import Image from "next/image";
import styles from "./styles.module.css";

export default function Subscribe() {
    return (
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
            <h3>Subscribe to BadgeFactory by selecting to subscribe as Customer or Entity.</h3>
        </main>
    );
}
