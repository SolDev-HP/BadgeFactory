// BadgeFactory logo
import Image from "next/image";
import LogoIcon from "../LogoIcon";

export default function Logo({}) {
  return (
    <>
      <div className="flex flex-row flex-nowrap">
        {/** Animated Badgefactory icon with 32x32 + 4px gap + BadgeFactory text logo */}
        <a href="/" className="flex flex-row flex-nowrap">
          <LogoIcon />
          <Image
            src={"/badgefactory_full_logo.svg"}
            height={48}
            width={215}
            alt="BadgeFactory"
            className="ml-[-26px] mr-[-26px]"
          />
        </a>
      </div>
    </>
  );
}
