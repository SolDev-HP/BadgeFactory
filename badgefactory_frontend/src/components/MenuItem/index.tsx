// Menuitem used through Menu in Navbar
// This will change for Navbar-Mobile
// [Icon] <Link> Menu Item </Link>
import Icon from "../Icon";
import Link from "next/link";
import styles from "./styles.module.css";

// is_active is optional, normal menuitem would have .normalitem class
// active meny w

export default function MenuItem({
  menu_text,
  menu_icon,
  menu_link,
  is_active = false,
}: {
  menu_text: string;
  menu_icon: string;
  menu_link: string;
  is_active?: boolean;
}) {
  return (
    <>
      <Link
        href={menu_link}
        title={menu_icon}
        className={is_active ? styles.activeitem : styles.normalitem}
      >
        <div className="flex gap-2 flex-row h-[36px] min-h-[36px] max-h-[36px] w-[220px] min-w-[220px] items-center py-2">
          <Icon icon_name={menu_icon} />
          <h3>{menu_text}</h3>
        </div>
      </Link>
    </>
  );
}
