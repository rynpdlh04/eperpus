import { useEffect, useState } from "react";
import {
  Search,
  ArrowLeft,
  RotateCcw
} from "lucide-react";

import { Link } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";

function AdminPeminjaman() {

  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");


  // ======================================
  // AMBIL DATA PEMINJAMAN
  // ======================================

  const fetchPeminjaman = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/admin/peminjaman",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

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


  return (

    <div className="min-h-screen bg-sky-50 md:ml-64">

      <AdminSidebar />


      <main className="p-6">

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


          {/* TABLE */}

          <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">

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

                <table className="w-full text-left">

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

                    {filteredPeminjaman.map(
                      (item) => (

                        <tr
                          key={item.id}
                          className="transition hover:bg-gray-50"
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
                              className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                                item.status ===
                                "dipinjam"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >

                              {item.status}

                            </span>

                          </td>


                          {/* AKSI */}

                          <td className="px-5 py-4">

                            {item.status ===
                            "dipinjam" ? (

                              <button
                                className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-100"
                              >

                                <RotateCcw
                                  size={16}
                                />

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