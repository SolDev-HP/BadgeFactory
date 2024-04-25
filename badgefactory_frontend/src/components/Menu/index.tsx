// Parent component of menu that contains multiple menu items
// How Menu structure looks like (not for mobile)
// [ItemIcon] ItemName
// ...
// [SocialIcon] SocialLink
'use client'
import { usePathname } from "next/navigation";
import MenuItem from "../MenuItem";

/// There are two divisions
//// MenuLink items
//// SocialLink items

export default function Menu({}) {
    // Check which path is active and set that path active for style change
    const pathname = usePathname();
  return (
    <>
      <div className="flex flex-col justify-between h-[90vh]">
        {/**  This is menu items section */}
        <div className="flex flex-col gap-1">
          <MenuItem
            menu_icon={"home_icon"}
            menu_link={"/"}
            menu_text={"Home"}
            is_active={pathname == "/" ? true : false}
          />
          <MenuItem
            menu_icon={"entity_icon"}
            menu_link={"/entity"}
            menu_text={"Entity Dashboard"}
            is_active={pathname == "/entity" ? true : false}
          />
          <MenuItem
            menu_icon={"cust_icon"}
            menu_link={"/customer"}
            menu_text={"Customer Dashboard"}
            is_active={pathname == "/customer" ? true : false}
          />
          <MenuItem
            menu_icon={"about_icon"}
            menu_link={"/about"}
            menu_text={"About BadgeFactory"}
            is_active={pathname == "/about" ? true : false}
          />
          <MenuItem
            menu_icon={"contact_icon"}
            menu_link={"/contact"}
            menu_text={"Contact Us"}
            is_active={pathname == "/contact" ? true : false}
          />
          <MenuItem
            menu_icon={"contact_icon"}
            menu_link={"/contracts"}
            menu_text={"Deployments"}
            is_active={pathname == "/contracts" ? true : false}
          />
        </div>
        {/**  This is for social links*/}
        <div className="flex flex-col gap-1">
          <MenuItem
            menu_icon={"bf_x_icon"}
            menu_link={"#"}
            menu_text={"Twitter ->"}
          />
          <MenuItem
            menu_icon={"bf_discord_icon"}
            menu_link={"#"}
            menu_text={"Discord ->"}
          />
          <MenuItem
            menu_icon={"bf_tg_icon"}
            menu_link={"#"}
            menu_text={"Telegram ->"}
          />
          <MenuItem
            menu_icon={"bf_docs_icon"}
            menu_link={"#"}
            menu_text={"Docs & Github ->"}
          />
        </div>
      </div>
    </>
  );
}
