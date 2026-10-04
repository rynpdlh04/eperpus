import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';

function RiwayatPeminjaman() {
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prosessingId, setProsessingId] = useState(null);
  

  const handleKembalikan = async (id) => {
  const konfirmasi = window.confirm(
    "Apakah buku ini benar-benar sudah dikembalikan?"
  );

  if (!konfirmasi) {
    return;
  }

  setProsessingId(id);

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:3000/api/peminjaman/${id}/kembalikan`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // Update data di halaman
    setPeminjaman((dataLama) =>
      dataLama.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "dikembalikan"
            }
          : item
      )
    );

  } catch (error) {

    console.error(error);

    alert(error.message);

  } finally {

    setProsessingId(null);

  }
};

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/peminjaman", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal mengambil riwayat peminjaman");
        }

        return data;
      })
      .then((data) => {
        setPeminjaman(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Gagal mengambil riwayat:",
          error
        );

        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Memuat riwayat peminjaman...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen sm:ml-64 bg-sky-50 p-6">
      <Sidebar />
      
      <div className="fixed top-0 left-0 sm:left-64 right-0 flex justify-between items-center mb-10 px-6 py-6 bg-white/30 backdrop-blur-lg">
            <Link
            to={`/`}
            className="flex gap-3 text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={30} />
            </Link>
        </div>

      <div className="mx-auto max-w-5xl mt-20">
        <div className="mt-6">

          <h1 className="text-3xl font-bold">
            Riwayat Peminjaman
          </h1>

          <p className="mt-2 text-gray-500">
            Daftar buku yang sedang dan pernah dipinjam.
          </p>

        </div>

        <div className="mt-6 flex flex-wrap gap-4 ">

          {peminjaman.length === 0 ? (

            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">
                Belum ada data peminjaman.
              </p>
            </div>

          ) : (

            peminjaman.map((item) => (

              <div
                key={item.id}
                className="min-w-0 w-75 overflow-hidden p-3 rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="">

                  <div>

                    <h2 className="text-lg font-bold">
                      {item.judul}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Kode buku: {item.kode_buku}
                    </p>

                    <p className="my-3 text-sm">
                      Peminjam:{" "}
                      <span className="font-medium">
                        {item.nama_peminjam}
                      </span>
                    </p>

                  </div>

                  <div className="text-sm">

                    <div className="flex justify-between">
                      <p className="text-gray-500">
                      Tanggal Pinjam
                    </p>
                    

                    <p className="font-medium">
                      {new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}
                    </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="mt-2 text-gray-500">
                      Batas Pengembalian
                    </p>

                    <p className="font-medium">
                      {new Date(item.tanggal_kembali).toLocaleDateString('id-ID')}
                    </p>
                    </div>

                  </div>

                 <div className="flex flex-col items-start gap-3">

                  {item.status === "dipinjam" ? (
                    <div className="flex justify-between gap-4 mt-2 mx-auto">
                      <span className="rounded-xl bg-yellow-100 px-3 py-2 text-xs font-medium text-yellow-700">
                        Sedang dipinjam
                      </span>

                      <button
                        onClick={() => handleKembalikan(item.id)}
                        disabled={prosessingId === item.id}
                        className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-sky-400 disabled:opacity-50"
                      >
                        {prosessingId === item.id
                          ? "Mengembalikan..."
                          : "Kembalikan Buku"}
                      </button>
                    </div>
                  ) : (
                    <span className="rounded-xl bg-green-100 px-3 py-2 text-xs font-medium text-green-700">
                      <Check className="inline mr-2"/> Dikembalikan
                    </span>
                  )}

                </div>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default RiwayatPeminjaman;