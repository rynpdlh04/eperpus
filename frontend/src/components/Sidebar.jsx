import { BookOpenText, Bookmark, House, LogOut } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import logo from "../assets/hok-logo.png";
import ConfirmDialog from "./ConfirmDialog";
import SidebarLayoutContext from "../contexts/SidebarLayoutContext";

function Sidebar() {
    const [confirmLogout, setConfirmLogout] = useState(false);
    const [localCollapsed, setLocalCollapsed] = useState(false);
    const layout = useContext(SidebarLayoutContext);
    const collapsed = layout?.userSidebarCollapsed ?? localCollapsed;
    const setCollapsed = layout?.setUserSidebarCollapsed ?? setLocalCollapsed;
    const navigationItems = [
        { label: "Beranda", href: "/", icon: House },
        { label: "Kategori", href: "/koleksi", icon: BookOpenText },
        { label: "Riwayat Peminjaman", href: "/riwayat", icon: Bookmark }
    ];

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setConfirmLogout(false);
        navigate("/login", { replace: true });
    }

    return (
        <>
        <aside className={`fixed inset-y-0 left-0 z-30 hidden h-screen border-r border-[#c5d8ec] bg-[#dceafa] shadow-[4px_0_20px_rgba(54,96,139,.06)] transition-[width] duration-200 md:block ${collapsed ? "w-19.5" : "w-64"}`}>
            <div className={`relative flex h-28 flex-col items-center justify-center border-b border-[#c8dbee] transition-[padding] duration-200 ${collapsed ? "px-2" : "px-5"}`}>
                <div className={`flex items-center justify-center rounded-2xl bg-[#c5ddf6] shadow-[0_6px_16px_rgba(61,109,158,.12)] transition-[width,height] duration-200 ${collapsed ? "h-11 w-11" : "h-14 w-14"}`}>
                    <img src={logo} width="48" alt="HOKLibrary" />
                </div>
                {!collapsed && (
                    <>
                        <h2 className="mt-2 text-base font-bold text-[#315f92]">HOKLibrary</h2>
                        <p className="mt-0.5 text-[11px] text-[#7892ad]">Perpustakaan digital HOK</p>
                    </>
                )}

                <button
                    type="button"
                    aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
                    title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-7 flex h-6 w-6 items-center justify-center rounded-full border border-[#b8cfe7] bg-white text-[#527ca7] shadow-sm transition-colors hover:bg-[#eaf4ff]"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            <nav aria-label="Navigasi utama" className={`mt-5 flex flex-col gap-1.5 ${collapsed ? "px-2" : "px-3"}`}>
                {!collapsed && (
                    <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#7b96b1]">
                        Menu Utama
                    </p>
                )}
                {navigationItems.map(({ label, href, icon: Icon }) => (
                    <NavLink
                        key={label}
                        to={href}
                        end={href === "/"}
                        className={({ isActive }) => `group relative flex h-12 items-center rounded-lg text-sm font-semibold transition-all duration-150 ${collapsed ? "justify-center px-1" : "gap-3 px-3"} ${isActive ? "bg-[#c6def5] text-[#315f92]" : "text-[#607b97] hover:translate-x-0.5 hover:bg-[#d1e5f8] hover:text-[#3e6895]"}`}
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-[#4f86bc] transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />
                                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${isActive ? "bg-[#dcecff] text-[#467bb4]" : "bg-[#d1e4f6] text-[#527ca7] group-hover:bg-[#e2effb]"}`}>
                                    <Icon size={18} strokeWidth={2} />
                                </span>
                                {!collapsed && <span className="truncate">{label}</span>}
                                {collapsed && (
                                    <span className="pointer-events-none absolute left-16.25 z-999 whitespace-nowrap rounded-lg border border-[#d8e8f6] bg-white px-3 py-2 text-xs font-semibold text-[#426889] opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                                        {label}
                                    </span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className={`absolute bottom-0 border-t border-[#c7d9eb] py-4 ${collapsed ? "inset-x-2" : "inset-x-4"}`}>
                <button
                    onClick={() => setConfirmLogout(true)}
                    title={collapsed ? "Keluar" : undefined}
                    className={`group relative flex h-12 w-full items-center rounded-lg text-sm font-semibold text-[#bd6f72] transition-colors hover:bg-[#f3dada] hover:text-[#aa5c60] ${collapsed ? "justify-center" : "gap-3 px-3 text-left"}`}
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#efd9da]">
                        <LogOut size={18} />
                    </span>
                    {!collapsed && <span>Keluar</span>}
                    {collapsed && (
                        <span className="pointer-events-none absolute left-16.25 z-999 whitespace-nowrap rounded-lg bg-[#bd6f72] px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                            Keluar
                        </span>
                    )}
                </button>
            </div>
        </aside>
        <ConfirmDialog
            open={confirmLogout}
            title="Keluar dari akun?"
            description="Sesi HOKLibrary akan diakhiri pada perangkat ini."
            confirmLabel="Keluar"
            onCancel={() => setConfirmLogout(false)}
            onConfirm={handleLogout}
        />
        </>
    );
}

export default Sidebar;