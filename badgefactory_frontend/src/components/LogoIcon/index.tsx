// BadgeFactory icon logo - use as favicon +
// at Navbar head
// [icon]-Logo

import Image from "next/image";

export default function LogoIcon({}) {
  return (
    <>
      <div className="h-[42px] w-[42px] border-x border-y border-white hover:border-bf-cobaltblue rounded-md p-1 overflow-hidden">
        {/* <Image
                src={"/home_animated_logo.svg"}
                height={24}
                width={24}
                alt={"BF"} /> */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/home_animated_icon.gif"
          alt="BF"
          style={{ width: "32px", height: "32px", background: "transparent" }}
        />
      </div>
    </>
  );
}
