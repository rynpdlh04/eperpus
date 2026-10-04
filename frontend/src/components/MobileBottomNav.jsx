import { Link } from "react-router-dom";
import { House, BookOpenText, Bookmark, Settings } from "lucide-react";

export default function MobileBottomNav() {
    const navigationItems = [
        { label: "Beranda", href: "/", icon: House },
        { label: "Kategori", href: "#", icon: BookOpenText },
        { label: "Favorit", href: "/riwayat", icon: Bookmark },
        { label: "Pengaturan", href: "#", icon: Settings }
    ];

    return (
        <div className="fixed w-[90%] inset-x-5 rounded-xl bottom-3 z-20 border-t shadow-md border-sky-100 bg-white/30 backdrop-blur-md md:hidden">

            <nav className="mx-auto grid max-w-md grid-cols-4">
                {navigationItems.map(({ label, href, icon: Icon }) => (
                    <Link
                        key={label}
                        to={href}
                        className="flex min-h-18 flex-1 flex-col items-center justify-center content-center place-items-center gap-1 text-center px-2 py-2 text-base "
                    >
                        <Icon size={25} strokeWidth={2} className="text-sky-500"/>
                        <span>{label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    )
}