import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Bookmark, CalendarFold, ListSortAscending, Info } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MobileBottomNav from "../components/MobileBottomNav";

function DetailBuku() {
    const { id } = useParams();

    const [buku, setBuku] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchBuku = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:3000/api/buku/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Buku tidak ditemukan"
          );
        }

        setBuku(data);

      } catch (error) {
        console.error(error)
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    fetchBuku();
  }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">
                    Memuat data buku...
                </p>
            </div>
        );
    }

    if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-5xl">

          <div className="rounded-2xl bg-white p-6">
            <p className="text-red-500">
              {error}
            </p>

            <Link
              to="/"
              className="mt-4 inline-block rounded-xl bg-black px-4 py-2 text-sm text-white"
            >
              Kembali
            </Link>
          </div>

        </div>
      </div>
    );
    }
    return (
      <div className="min-h-screen flex sm:ml-64 bg-sky-50 p-6 sm:px-20">
        <Sidebar/>

        <div className="w-full">

        {/* Tombol kembali */}
          <div className="fixed top-0 left-0 sm:left-64 right-0 flex justify-between items-center mb-10 px-6 py-6 bg-white/30 backdrop-blur-lg">
            <Link
            to={`/`}
            className="flex gap-3 text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={30} />
            </Link>
            
            <button className="border-0 outline-one text-gray-500">
              <Bookmark size={ 30 } />
            </button>  
        </div>

        {/* Cover */}
          <div className="flex h-90 max-w-[70%] mx-auto justify-center overflow-hidden rounded-xl bg-gray-100 mt-15 sm:h-96 sm:max-w-[50%]">

            {buku.cover ? (
              <img
                src={buku.cover}
                alt={`Cover ${buku.judul}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col justify-center text-gray-400">
                <p className="text-6xl">📖</p>

                <p className="mt-3 text-sm">
                  Coverna Te aya
                </p>
              </div>
            )}

          </div>

           <h1 className="mt-4 text-3xl text-center font-bold text-gray-900">
              {buku.judul}
            </h1>
          
            <p className="mt-2 text-lg text-gray-500 text-center">
              {buku.penulis}
            </p>

        {/* Detail Buku */}
        <div className="rounded-2xl mx-auto bg-white p-6 shadow-sm md:grid-cols-3 mt-3 sm:max-w-[60%]">

          {/* Informasi */}
          <div className="flex flex-col gap-4">
              <div className="flex justify-between gap-4 px-2">
                <CalendarFold size={22} />
                <span className="text-gray-500 flex-1 text-sm font-medium">Tahun Terbit</span>
                <span>{ buku.tahun }</span>
              </div>

              <div className="flex justify-between gap-4 px-2">
                <ListSortAscending size={22} />
                <span className="text-gray-500 flex-1 text-sm font-medium">Kategori</span>
                <span>{ buku.kategori }</span>
              </div>
              
              <div className="flex justify-between gap-4 px-2">
                <CalendarFold size={22} />
                <span className="text-gray-500 flex-1 text-sm font-medium">Stok</span>
                <span>{ buku.stock }</span>
              </div>

              <div className="flex justify-between gap-4 px-2">
                <Info size={22} />
                <span className="text-gray-500 flex-1 text-sm font-medium">Status</span>
                <span>{ buku.stock > 0 ? "Tersedia" : "Kosong" }</span>
              </div>
            </div>
          </div>
          
          <div className="p-2 mt-4 mx-auto sm:w-[60%]">
            <h3 className="text-xl font-bold">Deskripsi</h3>
            <p className="text-gray-500 mt-3 min-h-32">
              {buku.deskripsi ? buku.deskripsi : "belum ada deskripsi"}
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              to={`/peminjaman/${id}`}
              
            className="w-9/12 mb-20 text-xl font-bold text-center py-2 bg-sky-500 text-white rounded-lg sm:w-[60%] sm:mb-10"
          >
            Pinjam buku
          </Link>
          </div>
          
          <MobileBottomNav/>

      </div>

    </div>
    )
}

export default DetailBuku;