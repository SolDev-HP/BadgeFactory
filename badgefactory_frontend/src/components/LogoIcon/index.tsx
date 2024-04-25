// BadgeFactory icon logo - use as favicon +
// at Navbar head
// [icon]-Logo

import Image from "next/image";

export default function LogoIcon({}) {
  return (
    <>
      <div className="h-[48px] w-[48px] border-x border-y border-bf-comp-border rounded-md p-2 overflow-hidden">
        {/* <Image
                src={"/home_animated_logo.svg"}
                height={24}
                width={24}
                alt={"BF"} /> */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/home_animated_logo.gif"
          alt="BF"
          style={{ width: "32px", height: "32px", background: "transparent" }}
        />
      </div>
    </>
  );
}
