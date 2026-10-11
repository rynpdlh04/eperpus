import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useState } from "react";
import {
    BookOpenText,
    ClipboardList,
    House,
    LogOut,
    Users,
    Bookmark
} from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

export default function MobileBottomNav() {
    const [confirmLogout, setConfirmLogout] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "admin";
    const navigationItems = isAdmin
        ? [
            { label: "Dashboard", href: "/admin", icon: House },
            { label: "Buku", href: "/admin/buku", icon: BookOpenText },
            { label: "Pinjaman", href: "/admin/peminjaman", icon: ClipboardList },
            { label: "Pengguna", href: "/admin/users", icon: Users }
        ]
        : [
            { label: "Beranda", href: "/", icon: House },
            { label: "Koleksi", href: "/koleksi", icon: BookOpenText },
            { label: "Riwayat", href: "/riwayat", icon: Bookmark }
        ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setConfirmLogout(false);
        navigate("/login", { replace: true });
    };

    if (["/login", "/register"].includes(location.pathname)) {
        return null;
    }

    return (
        <>
        <div className="relative z-50 mx-auto w-full max-w-xl shrink-0 rounded-t-2xl border border-b-0 border-[#bcd3e9] bg-[#dceafa]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_10px_30px_rgba(49,95,146,.16)] backdrop-blur-xl md:hidden">
            <nav aria-label="Navigasi utama" className={`grid ${isAdmin ? "grid-cols-5" : "grid-cols-4"}`}>
                {navigationItems.map(({ label, href, icon: Icon }) => (
                    <NavLink
                        key={href}
                        to={href}
                        end={href === "/" || href === "/admin"}
                        className={({ isActive }) =>
                            `m-1 flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold transition-colors duration-150 ${isActive ? "bg-white/65 text-[#315f92]" : "text-[#6f8cab] hover:bg-white/35 hover:text-[#315f92]"}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`flex h-8 w-10 items-center justify-center rounded-xl transition-colors ${isActive ? "bg-white/80" : ""}`}>
                                    <Icon size={20} strokeWidth={2} />
                                </span>
                                <span>{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
                <button
                    type="button"
                    onClick={() => setConfirmLogout(true)}
                    className="m-1 flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold text-[#bd6f72] transition-colors duration-150 hover:bg-[#fff0f1] hover:text-[#aa5c60]"
                >
                    <span className="flex h-8 w-10 items-center justify-center rounded-xl">
                        <LogOut size={20} strokeWidth={2} />
                    </span>
                    <span>Keluar</span>
                </button>
            </nav>
        </div>
        <ConfirmDialog
            open={confirmLogout}
            title={isAdmin ? "Keluar dari akun admin?" : "Keluar dari akun?"}
            description="Sesi HOKLibrary akan diakhiri pada perangkat ini."
            confirmLabel="Keluar"
            onCancel={() => setConfirmLogout(false)}
            onConfirm={handleLogout}
        />
        </>
    );
}
