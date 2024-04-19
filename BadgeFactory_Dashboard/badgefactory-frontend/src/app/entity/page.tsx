// Entity dashboard route
// If logged in user is subscribed as 
import Image from "next/image";
import styles from "./styles.module.css";

export default function Entity() {
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
            <h3>This is Entity Dashboard</h3>
        </main>
    );
}
