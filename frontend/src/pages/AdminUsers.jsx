import { useEffect, useState } from "react";
import {
  Search,
  Users,
  Trash2
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import useSidebarLayout from "../contexts/useSidebarLayout";
const API_URL = import.meta.env.VITE_API_URL;

function AdminUsers() {
  const { adminSidebarCollapsed } = useSidebarLayout();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);


  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengambil data pengguna"
        );
      }

      setUsers(data);

    } catch (error) {
      console.error(error);
      alert(error.message);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);


  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    return (
      user.nama?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword)
    );
  });


  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    return new Date(tanggal).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
    };
    

    const handleChangeRole = async (user) => {
        const newRole =
            user.role === "admin"
            ? "user"
            : "admin";

        const yakin = window.confirm(
            `Apakah role ${user.nama} akan diubah menjadi ${newRole}?`
        );

        if (!yakin) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
            `${API_URL}/api/admin/users/${user.id}/role`,
            {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                role: newRole
                })
            }
            );

            const data = await response.json();

            if (!response.ok) {
            throw new Error(
                data.message || "Gagal mengubah role"
            );
            }

            alert(data.message);

            fetchUsers();

        } catch (error) {
            console.error(error);

            alert(error.message);
        }
    };
    
    const handleDeleteUser = async (user) => {
        const yakin = window.confirm(
            `Apakah Anda yakin ingin menghapus pengguna "${user.nama}"?`
        );

        if (!yakin) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
            `${API_URL}/api/admin/users/${user.id}`,
            {
                method: "DELETE",
                headers: {
                Authorization: `Bearer ${token}`
                }
            }
            );

            const data = await response.json();

            if (!response.ok) {
            throw new Error(
                data.message || "Gagal menghapus pengguna"
            );
            }

            alert(data.message);

            fetchUsers();

        } catch (error) {
            console.error(error);

            alert(error.message);
        }
        };


  return (
    <div className="page-enter min-h-screen bg-[#f4f8fd] pb-24 md:pb-6">

      <AdminSidebar />

      <main className={`p-4 md:p-8 ${adminSidebarCollapsed ? "md:ml-19.5" : "md:ml-58"}`}>

        {/* Header */}
        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-600 text-white">
              <Users size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pengguna
              </h1>

              <p className="text-sm text-gray-500">
                Kelola pengguna perpustakaan
              </p>
            </div>

          </div>

        </div>


        {/* Statistik sederhana */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Total Pengguna
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {users.length}
            </p>

          </div>


          <div className="rounded-2xl bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Admin
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {
                users.filter(
                  (user) => user.role === "admin"
                ).length
              }
            </p>

          </div>


          <div className="rounded-2xl bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Pengguna Biasa
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {
                users.filter(
                  (user) => user.role === "user"
                ).length
              }
            </p>

          </div>

        </div>


        {/* Search */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-sky-500"
            />

          </div>

        </div>


        {/* Table */}
        <div className="admin-table-wrap">

          {loading ? (

            <div className="p-8 text-center text-gray-500">
              Memuat data pengguna...
            </div>

          ) : filteredUsers.length === 0 ? (

            <div className="p-8 text-center text-gray-500">
              Tidak ada pengguna ditemukan.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="admin-table">

                <thead className="border-b bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Pengguna
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Email
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Role
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Terdaftar
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Aksi
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-gray-100">

                  {filteredUsers.map((user) => (

                    <tr
                      key={user.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Nama */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-700">
                            {user.nama
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>

                            <p className="font-medium text-gray-900">
                              {user.nama}
                            </p>

                            <p className="text-xs text-gray-500">
                              ID #{user.id}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Email */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>


                      {/* Role */}
                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.role === "admin"
                            ? "Admin"
                            : "User"}
                        </span>

                      </td>


                      {/* Tanggal */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatTanggal(user.created_at)}
                      </td>


                      {/* Aksi */}
                      <td className="px-6 py-4">

                        <div className="flex flex-wrap gap-2">

                            <button
                                onClick={() => handleChangeRole(user)}
                                className="rounded-lg bg-sky-100 px-3 py-2 text-xs font-medium text-sky-700 transition hover:bg-sky-200"
                            >
                                Ubah Role
                            </button>

                            <button
                            onClick={() => handleDeleteUser(user)}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-200"
                            >
                            <Trash2 size={15} />
                            Hapus
                            </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}


export default AdminUsers;