import { BookOpenText, Bookmark, House, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/hok-logo.png';

function Sidebar() {
    const navigationItems = [
        { label: "Beranda", href: "/", icon: House },
        { label: "Kategori", href: "#", icon: BookOpenText },
        { label: "Favorit", href: "/riwayat", icon: Bookmark },
        { label: "Pengaturan", href: "#", icon: Settings }
    ];

    const navigate = useNavigate();
    const handleLogout = () => {
        const konfirm = confirm("Keluar?");

        if (konfirm) {
            localStorage.removeItem("token");
            localStorage.removeItem("user")

            navigate("/login", {
                replace: true
            });
        }
    }

    return (
        <aside className="fixed inset-y-0 left-0 z-20 hidden h-screen w-64 border-r border-sky-100 bg-white sm:block">
            <div className="flex flex-col items-center py-6">
                <img
                    src={logo}
                    width="80"
                />
                <h2 className="text-lg font-bold">HOKLibrary</h2>
                <p className="mt-1 text-xs text-gray-500">
                    Perpustakaan digital HOK
                </p>
            </div>

            <nav className="mt-6 flex flex-col gap-4 px-4">
                {navigationItems.map(({ label, href, icon: Icon }) => (
                    <Link
                        key={label}
                        to={href}
                        className="flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-sky-50 hover:text-sky-700 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]"
                    >
                        <Icon size={18} strokeWidth={2} className=""/>
                        <span>{label}</span>
                    </Link>
                ))}
            </nav>

            <div className="absolute block bottom-15 w-9/12 text-center translate-x-[50%] right-[50%]">
                <button
          onClick={handleLogout}
          className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
                    <LogOut size={ 18} className="inline-block ml-2 mr-2" />
                    <span>Logout</span>
        </button>
            </div>
        </aside>
    );
}

export default Sidebar;