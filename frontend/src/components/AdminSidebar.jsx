import { Link, useLocation, useNavigate } from "react-router-dom";
    import { useContext, useState } from "react";
import { LayoutDashboard, BookOpen, Users, ClipboardList, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import logo from "../assets/hok-logo.png";
import ConfirmDialog from "./ConfirmDialog";
import SidebarLayoutContext from "../contexts/SidebarLayoutContext";

function AdminSidebar({ collapsed: collapsedProp, setCollapsed: setCollapsedProp }) {
    const [confirmLogout, setConfirmLogout] = useState(false);
    const layout = useContext(SidebarLayoutContext);
    const collapsed = collapsedProp ?? layout?.adminSidebarCollapsed ?? false;
    const setCollapsed = setCollapsedProp ?? layout?.setAdminSidebarCollapsed;
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setConfirmLogout(false);
        navigate("/login", { replace: true });
    };

    const menu = [
        { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { path: "/admin/buku", label: "Kelola Buku", icon: BookOpen },
        { path: "/admin/peminjaman", label: "Peminjaman", icon: ClipboardList },
        { path: "/admin/users", label: "Pengguna", icon: Users }
    ];

    return (
        <>
        <aside className={`fixed left-0 top-0 z-30 hidden h-screen border-r border-[#c5d8ec] bg-[#dceafa] shadow-[4px_0_20px_rgba(54,96,139,0.06)] transition-[width] duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:block ${collapsed ? "w-19.5" : "w-58"}`}>
            <div className="relative flex h-full flex-col overflow-visible">
                <div className={`flex h-23 shrink-0 items-center border-b border-[#c8dbee] transition-all duration-500 ${collapsed ? "justify-center px-3" : "justify-between px-5"}`}>
                    <div className="flex min-w-0 items-center gap-3">
                        <div className={`flex shrink-0 items-center justify-center rounded-2xl bg-[#c5ddf6] shadow-[0_6px_16px_rgba(61,109,158,0.12)] transition-all duration-500 ${collapsed ? "h-11 w-11" : "h-12 w-12"}`}>
                            <img src={logo} alt="HOKLibrary" className={`w-auto object-contain transition-all duration-500 ${collapsed ? "h-9" : "h-10"}`} />
                        </div>
                        <div className={`overflow-hidden whitespace-nowrap transition-all duration-500 ease-out ${collapsed ? "w-0 -translate-x-2.5 opacity-0" : "w-31.25 translate-x-0 opacity-100"}`}>
                            <h1 className="text-[17px] font-bold tracking-tight text-[#294f79]">HOKLibrary</h1>
                            <p className="mt-0.5 text-[10px] text-[#7892ad]">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {!collapsed && setCollapsed && (
                    <button
                        type="button"
                        aria-label="Tutup sidebar"
                        title="Tutup sidebar"
                        onClick={() => setCollapsed(true)}
                        className="absolute -right-2.75 top-9 z-200 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[#b8cfe7] bg-[#eaf4ff] text-[#527ca7] shadow-[0_3px_10px_rgba(55,101,148,0.15)] transition-all duration-300 hover:scale-110 hover:bg-white"
                    >
                        <ChevronLeft size={14} />
                    </button>
                )}

                {collapsed && setCollapsed && (
                    <button
                        type="button"
                        aria-label="Buka sidebar"
                        title="Buka sidebar"
                        onClick={() => setCollapsed(false)}
                        className="absolute -right-2.75 top-9 z-200 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[#b8cfe7] bg-[#eaf4ff] text-[#527ca7] shadow-[0_3px_10px_rgba(55,101,148,0.15)] transition-all duration-300 hover:scale-110 hover:bg-white"
                    >
                        <ChevronRight size={14} />
                    </button>
                )}

                <nav className={`flex flex-1 flex-col gap-2 transition-all duration-500 ${collapsed ? "px-3 pt-7" : "px-4 pt-7"}`}>
                    {!collapsed && (
                        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7b96b1]">Menu Utama</p>
                    )}

                    {menu.map((item) => {
                        const Icon = item.icon;
                        const active = item.path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group relative flex h-12 shrink-0 items-center rounded-xl transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${collapsed ? "justify-center" : "gap-3 px-3"} ${active ? "bg-[#bcd8f3] text-[#315f92] shadow-[0_6px_16px_rgba(59,108,158,0.12)]" : "text-[#607b97] hover:bg-[#d1e5f8] hover:text-[#3e6895]"}`}
                            >
                                <span className={`absolute left-0 top-1/2 h-6 w-0.75 -translate-y-1/2 rounded-r-full bg-[#4f86bc] transition-all duration-300 ${active ? "opacity-100" : "opacity-0"}`} />
                                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${active ? "bg-[#dcecff] text-[#467bb4] shadow-sm" : "bg-[#d1e4f6] text-[#7c97b2] group-hover:scale-105 group-hover:bg-[#dcecff] group-hover:text-[#4e7fb2]"}`}>
                                    <Icon size={18} strokeWidth={1.9} />
                                </span>

                                {!collapsed && (
                                    <span className="overflow-hidden whitespace-nowrap text-[13px] font-semibold">{item.label}</span>
                                )}

                                {collapsed && (
                                    <span className="pointer-events-none absolute left-16.25 z-999 flex items-center gap-2 whitespace-nowrap rounded-xl border border-[#d8e8f6] bg-white/95 px-3.5 py-2.5 text-[12px] font-semibold text-[#426889] opacity-0 shadow-[0_8px_25px_rgba(64,111,153,0.16)] backdrop-blur-md transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#6fa4d2]" />
                                        {item.label}
                                    </span>
                                )}

                                <span className={`absolute right-3 h-1.5 w-1.5 rounded-full bg-[#5289c0] transition-all duration-300 ${active && !collapsed ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} />
                            </Link>
                        );
                    })}
                </nav>

                <div className={`shrink-0 border-t border-[#c7d9eb] transition-all duration-500 ${collapsed ? "px-3 py-5" : "px-4 py-5"}`}>
                    <button
                        onClick={() => setConfirmLogout(true)}
                        className={`group relative flex h-12 w-full items-center rounded-xl text-[13px] font-semibold text-[#bd6f72] transition-all duration-300 hover:bg-[#f3dada] hover:text-[#aa5c60] ${collapsed ? "justify-center" : "gap-3 px-3"}`}
                    >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#efd9da] transition-all duration-300 group-hover:scale-105">
                            <LogOut size={18} strokeWidth={1.9} />
                        </span>

                        {!collapsed && (
                            <span className="overflow-hidden whitespace-nowrap">Logout</span>
                        )}

                        {collapsed && (
                            <span className="pointer-events-none absolute left-15.5 z-999 whitespace-nowrap rounded-lg bg-[#bd6f72] px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-[0_6px_18px_rgba(140,70,70,0.2)] transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                                Logout
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </aside>
        <ConfirmDialog
            open={confirmLogout}
            title="Keluar dari akun admin?"
            description="Sesi admin HOKLibrary akan diakhiri pada perangkat ini."
            confirmLabel="Keluar"
            onCancel={() => setConfirmLogout(false)}
            onConfirm={handleLogout}
        />
        </>
    );
}

export default AdminSidebar;