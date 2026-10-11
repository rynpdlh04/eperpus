import { useEffect, useState } from "react";
import {
  Search,
  ArrowLeft,
  RotateCcw
} from "lucide-react";

import { Link } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import useSidebarLayout from "../contexts/useSidebarLayout";

async function parseApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const responseText = await response.text();
    const detail = responseText.replace(/<[^>]*>/g, " ").trim().slice(0, 120);

    throw new Error(
      `Server mengirim respons non-JSON (HTTP ${response.status}). ${detail}`
    );
  }

  return response.json();
}

function AdminPeminjaman() {
  const { adminSidebarCollapsed } = useSidebarLayout();

    const [peminjaman, setPeminjaman] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("semua");
    const API_URL = import.meta.env.VITE_API_URL;

  // ======================================
  // AMBIL DATA PEMINJAMAN
  // ======================================

    const fetchPeminjaman = async () => {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/api/admin/peminjaman`,
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        );

        const data = await parseApiResponse(response);

        if (!response.ok) {
            throw new Error(
            data.message ||
            "Gagal mengambil data peminjaman"
            );
        }

        setPeminjaman(data);

        } catch (error) {

        console.error(error);

        alert(error.message);

        } finally {

        setLoading(false);

    }
    };


    useEffect(() => {
        fetchPeminjaman();
    }, []);


  // ======================================
  // SEARCH
  // ======================================

    const filteredPeminjaman = peminjaman.filter(
    (item) => {

        const keyword =
        search.toLowerCase();

        return (
        item.nama_peminjam
            ?.toLowerCase()
            .includes(keyword) ||

        item.judul
            ?.toLowerCase()
            .includes(keyword) ||

        item.kode_buku
            ?.toLowerCase()
            .includes(keyword)
        );
    }
    );

    const peminjamanFiltered = peminjaman.filter((item) => {
    const status = item.status?.toLowerCase();

    const terlambat =
        status === "dipinjam" &&
        new Date(item.tanggal_kembali).getTime() <
        new Date().setHours(0, 0, 0, 0);

    if (filterStatus === "semua") {
        return true;
    }

    if (filterStatus === "terlambat") {
        return terlambat;
    }

    return status === filterStatus;
    });




  // ======================================
  // FORMAT TANGGAL
  // ======================================

    const formatTanggal = (tanggal) => {

    if (!tanggal) {
    return "-";
    }

    return new Date(tanggal).toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
    };
    
    const handleReturn = async (item) => {
    const yakin = window.confirm(
    `Apakah buku "${item.judul}" akan dikembalikan?`
    );

    if (!yakin) {
        return;
    }

    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
        `${API_URL}/api/admin/peminjaman/${item.id}/kembalikan`,
        {
            method: "PUT",
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await parseApiResponse(response);

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengembalikan buku");
    }

    alert(data.message);

    fetchPeminjaman();

  } catch (error) {
    console.error(error);

    alert(error.message);
  }
};


  return (

    <div className={`page-enter min-h-screen bg-[#f4f8fd] pb-24 md:pb-6 ${adminSidebarCollapsed ? "md:ml-19.5" : "md:ml-58"}`}>

      <AdminSidebar />


      <main className="p-4 sm:p-6">

        <div className="mx-auto max-w-7xl">


          {/* HEADER */}

          <div>

            <Link
              to="/admin"
              className="mb-3 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={18} />

              Kembali ke Dashboard
            </Link>


            <h1 className="text-3xl font-bold">
              Peminjaman
            </h1>


            <p className="mt-1 text-gray-500">
              Kelola seluruh transaksi peminjaman buku.
            </p>

          </div>


          {/* SEARCH */}

          <div className="relative mt-8">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Cari nama peminjam, judul buku, atau kode buku..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none focus:border-sky-400"
            />

          </div>


          <div className="mt-4 text-sm text-gray-500">

            Menampilkan{" "}
            {filteredPeminjaman.length}{" "}
            dari{" "}
            {peminjaman.length}{" "}
            peminjaman

          </div>

            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {[
                { label: "Semua", value: "semua" },
                { label: "Dipinjam", value: "dipinjam" },
                { label: "Dikembalikan", value: "dikembalikan" },
                { label: "Terlambat", value: "terlambat" },
            ].map((filter) => (
                <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition ${
                    filterStatus === filter.value
                    ? "bg-sky-600 text-white"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
                >
                {filter.label}
                </button>
            ))}
            </div>


          {/* TABLE */}

          <div className="admin-table-wrap mt-4">

            {loading ? (

              <div className="p-10 text-center text-gray-500">

                Memuat data peminjaman...

              </div>

            ) : filteredPeminjaman.length === 0 ? (

              <div className="p-10 text-center text-gray-500">

                Data peminjaman tidak ditemukan.

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="admin-table admin-table--wide">

                  <thead className="border-b bg-gray-50">

                    <tr>

                      <th className="px-5 py-4 text-sm font-semibold">
                        Peminjam
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold">
                        Buku
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold">
                        Tanggal Pinjam
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold">
                        Batas Kembali
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold">
                        Status
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold">
                        Aksi
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y">

                    {peminjamanFiltered.map(
                        (item) => {
                            const statusAsli = item.status?.toLowerCase();

                            const isTerlambat =
                                statusAsli === "dipinjam" &&
                                new Date(item.tanggal_kembali).getTime() <
                                new Date().setHours(0, 0, 0, 0);

                            const labelStatus = isTerlambat
                                ? "Terlambat"
                                : statusAsli === "dikembalikan"
                                    ? "Dikembalikan"
                                    : "Dipinjam";
                        
                        
                            return (

                                <tr
                                    key={item.id}
                                    className="transition border-b border-gray-300 hover:bg-gray-50"
                                >

                                    {/* PEMINJAM */}

                                    <td className="px-5 py-4">

                                        <p className="font-semibold">
                                            {item.nama_peminjam}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            ID #{item.user_id}
                                        </p>

                                    </td>


                                    {/* BUKU */}

                                    <td className="px-5 py-4">

                                        <p className="font-semibold">
                                            {item.judul}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            {item.kode_buku}
                                        </p>

                                    </td>


                                    {/* TANGGAL PINJAM */}

                                    <td className="px-5 py-4 text-sm text-gray-600">

                                        {formatTanggal(
                                            item.tanggal_pinjam
                                        )}

                                    </td>


                                    {/* BATAS KEMBALI */}

                                    <td className="px-5 py-4 text-sm text-gray-600">

                                        {formatTanggal(
                                            item.tanggal_kembali
                                        )}

                                    </td>


                                    {/* STATUS */}
                            
                                    <td className="px-5 py-4">

                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isTerlambat
                                                ? "bg-red-100 text-red-700"
                                                : statusAsli === "dikembalikan"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {labelStatus}
                                        </span>

                                    </td>


                                    {/* AKSI */}

                                    <td className="px-5 py-4">

                                        {item.status ===
                                            "dipinjam" ? (

                                            <button
                                                onClick={() => handleReturn(item)}
                                                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                            >
                                                <RotateCcw size={16} />
                                                Kembalikan
                                            </button>

                                        ) : (

                                            <span className="text-sm text-gray-400">
                                                Selesai
                                            </span>

                                        )}

                                    </td>

                                </tr>
                        
                            )
                        }
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminPeminjaman;