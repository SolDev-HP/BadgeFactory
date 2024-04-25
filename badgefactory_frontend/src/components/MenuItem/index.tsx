// Menuitem used through Menu in Navbar
// This will change for Navbar-Mobile
// [Icon] <Link> Menu Item </Link>
import Icon from "../Icon"
import Link from "next/link"

export default function MenuItem({ menu_text, menu_icon, menu_link } : { menu_text: string, menu_icon: string, menu_link: string}) {
    return(<>
        <Link
            href={menu_link}
            title={menu_icon}
            className="h-[36px] min-h-[36px] px-2 hover:border-x hover:border-y hover:border-white hover:rounded-lg hover:bg-black"
            >
            <div className="flex gap-2 flex-row h-[36px] min-h-[36px] max-h-[36px] w-[220px] min-w-[220px] items-center py-2">
                <Icon icon_name={menu_icon} />
                <h3>{menu_text}</h3>
            </div>
        </Link>
    </>)
}