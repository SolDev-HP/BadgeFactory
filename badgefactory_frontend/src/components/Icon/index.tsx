//// Icon component, maintains list of all available icons in badgefactory
//// maintainable icon registry for badgefactory frontend, I'll make sure to use icons
//// through this so I cna add required icons as I go and have more control over them
//// in the future versions
import Image from "next/image";

export default function Icon({ icon_name } : { icon_name: string }) {
    const all_icons = {
        home_icon : "/icons/home_icon.svg",
        entity_icon : "/icons/entity_icon.png",
        cust_icon : "/icons/customer_icon.png",
        about_icon : "/icons/about_icon.png",
        contact_icon : "/icons/contact_icon.png",
        bf_x_icon : "/icons/x_icon.png",
        bf_discord_icon : "/icons/discord_icon.png",
        bf_tg_icon : "/icons/tg_icon.png",
        bf_web_icon : "/icons/web_icon.png",
        bf_docs_icon : "/icons/docs_icon.png",
        d0_web_icon : "/icons/web_icon.png",
        d0_x_icon : "/icons/x_icon.png",
        d0_blog_icon : "/icons/blog_icon.png",
        d0_lkdin_icon : "/icons/lkdin_icon.png",
    }
    // Have to find a better way, but struct type has to be fixed , any wont work
    ///// @todo fix this, but it will work for now
    const find_icon = icon_name as 'home_icon' | 'entity_icon' | 'cust_icon' | 'about_icon' | 'contact_icon' | 'bf_x_icon' | 'bf_discord_icon' | 'bf_tg_icon' | 'bf_web_icon' | 'bf_docs_icon' | 'd0_web_icon' | 'd0_x_icon' | 'd0_blog_icon' | 'd0_lkdin_icon';
    return(<>
        <div className="w-[16px] h-[16px] min-h-[16px] min-w-[16px] max-h-[16px] max-w-[16px]">
            <Image
                src={all_icons[find_icon]}
                alt={icon_name}
                height={16}
                width={16}
                className="mr-2"
                layout="cover"
                />
        </div>
    </>)
}