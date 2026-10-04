import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  LogOut
} from "lucide-react";
import logo from '../assets/hok-logo.png'

function AdminSidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-white md:block">

      {/* Logo */}
      <div className="flex flex-col items-center px-6 py-8">

        <img
          src={logo}
          alt="HOKLibrary"
          className="h-20 w-auto"
        />

        <h1 className="mt-4 text-xl font-bold">
          HOKLibrary
        </h1>

        <p className="mt-1 text-xs text-gray-500">
          Admin Panel
        </p>

      </div>

      {/* Menu */}
      <nav className="mt-6 flex flex-col gap-4 px-4">

        <Link
          to="/admin"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-sky-50"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          to="/admin/buku"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-sky-50"
        >
          <BookOpen size={20} />
          Kelola Buku
        </Link>

        <Link
          to="/admin/peminjaman"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-sky-50"
        >
          <ClipboardList size={20} />
          Peminjaman
        </Link>

        <Link
          to="/admin/users"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-sky-50"
        >
          <Users size={20} />
          Pengguna
        </Link>

      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-4 right-4">

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default AdminSidebar;