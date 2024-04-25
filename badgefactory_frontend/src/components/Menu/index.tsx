// Parent component of menu that contains multiple menu items
// How Menu structure looks like (not for mobile)
// [ItemIcon] ItemName
// ...
// [SocialIcon] SocialLink

import MenuItem from "../MenuItem";

/// There are two divisions
//// MenuLink items
//// SocialLink items

export default function Menu({}) {
  return (
    <>
      <div className="flex flex-col justify-between h-[90vh]">
        {/**  This is menu items section */}
        <div className="flex flex-col gap-1">
          <MenuItem
            menu_icon={"home_icon"}
            menu_link={"/"}
            menu_text={"Home"}
            is_active={true}
          />
          <MenuItem
            menu_icon={"entity_icon"}
            menu_link={"/entity"}
            menu_text={"Entity Dashboard"}
          />
          <MenuItem
            menu_icon={"cust_icon"}
            menu_link={"/customer"}
            menu_text={"Customer Dashboard"}
          />
          <MenuItem
            menu_icon={"about_icon"}
            menu_link={"/about"}
            menu_text={"About BadgeFactory"}
          />
          <MenuItem
            menu_icon={"contact_icon"}
            menu_link={"/contact"}
            menu_text={"Contact Us"}
          />
          <MenuItem
            menu_icon={"contact_icon"}
            menu_link={"/contracts"}
            menu_text={"Deploments"}
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
