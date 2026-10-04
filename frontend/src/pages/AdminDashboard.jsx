import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

function AdminDashboard() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Gagal mengambil data dashboard"
          );
        }

        setData(result);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchDashboard();

  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Memuat dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 md:ml-64 p-6">
        <AdminSidebar />

      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Kelola perpustakaan HOKLibrary
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Buku
            </p>

            <p className="mt-2 text-3xl font-bold">
              {data.totalBuku}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Stock
            </p>

            <p className="mt-2 text-3xl font-bold">
              {data.totalStock}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Pengguna
            </p>

            <p className="mt-2 text-3xl font-bold">
              {data.totalPengguna}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Sedang Dipinjam
            </p>

            <p className="mt-2 text-3xl font-bold">
              {data.totalDipinjam}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;