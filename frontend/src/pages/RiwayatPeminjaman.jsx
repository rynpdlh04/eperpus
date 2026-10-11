import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronLeft } from 'lucide-react';
import Header from '../components/Header';
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
      <div className="page-enter min-h-screen bg-[#f4f8fd] pb-24 md:pb-0">
        <Header />
        <Sidebar />
        <main className="flex min-h-[calc(100vh-68px)] items-center justify-center px-4 text-center md:ml-64">
          <p className="text-sm font-medium text-[#7892ad]">Memuat riwayat peminjaman...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page-enter min-h-screen bg-[#f4f8fd] pb-24 md:pb-0">
      <Header />
      <Sidebar />

      <main className="mx-auto max-w-7xl px-4 py-6 md:ml-64 md:px-6">
        <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#5b8fbd] transition hover:text-[#315f92]">
          <ChevronLeft size={18} />
          Kembali ke koleksi
        </Link>

        <div>

          <h1 className="text-3xl font-bold text-[#29465f]">
            Riwayat Peminjaman
          </h1>

          <p className="mt-2 text-[#7892ad]">
            Daftar buku yang sedang dan pernah dipinjam.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-lg bg-[#fff5df] px-3 py-1.5 text-xs font-semibold text-[#96712e]">
              {peminjaman.filter((item) => item.status === "dipinjam").length} sedang dipinjam
            </span>
            <span className="rounded-lg bg-[#edf8f1] px-3 py-1.5 text-xs font-semibold text-[#4d8762]">
              {peminjaman.filter((item) => item.status === "dikembalikan").length} selesai
            </span>
          </div>

        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {peminjaman.length === 0 ? (

            <div className="rounded-xl border border-dashed border-[#cbdceb] bg-white/70 p-10 text-center">
              <p className="text-sm text-[#7892ad]">
                Belum ada data peminjaman.
              </p>
            </div>

          ) : (

            peminjaman.map((item) => (

              <div
                key={item.id}
                className="min-w-0 overflow-hidden rounded-xl border border-[#dce7f1] bg-white p-4 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#bfd4e8] hover:shadow-[0_8px_22px_rgba(54,96,139,.08)] motion-reduce:transition-none"
              >

                <div className="">

                  <div>

                    <h2 className="line-clamp-2 text-base font-bold leading-6 text-[#29465f]">
                      {item.judul}
                    </h2>

                    <p className="mt-1 text-xs text-[#7892ad]">
                      {item.kode_buku}
                    </p>

                    <p className="mt-3 text-xs text-[#7892ad]">
                      Peminjam <span className="font-semibold text-[#456b8c]">
                        {item.nama_peminjam}
                      </span>
                    </p>

                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-[#f7faff] p-3 text-xs">

                    <div className="min-w-0">
                      <p className="leading-4 text-[#7892ad]">Tanggal Pinjam</p>
                      <p className="mt-1 font-semibold tabular-nums text-[#405b75]">
                        {new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="leading-4 text-[#7892ad]">Batas Kembali</p>
                      <p className="mt-1 font-semibold tabular-nums text-[#405b75]">
                        {new Date(item.tanggal_kembali).toLocaleDateString('id-ID')}
                      </p>
                    </div>

                  </div>

                 <div className="mt-4">

                  {item.status === "dipinjam" ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e8eff6] pt-4">
                      <span className="rounded-md bg-[#fff5df] px-2.5 py-1.5 text-[11px] font-semibold text-[#96712e]">
                        Sedang dipinjam
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-[#edf8f1] px-2.5 py-1.5 text-[11px] font-semibold text-[#4d8762]">
                      <Check className="inline mr-2"/> Dikembalikan
                    </span>
                  )}

                </div>

                </div>

              </div>

            ))

          )}

        </div>

      </main>

    </div>
  );
}

export default RiwayatPeminjaman;