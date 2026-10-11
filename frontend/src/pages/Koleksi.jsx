import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import CategoryFilter from "../components/CategoryFilter";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Sidebar from "../components/Sidebar";
import { CATALOG_CATEGORIES } from "../constants/bookCategories";
import useSidebarLayout from "../contexts/useSidebarLayout";

  const API_URL = import.meta.env.VITE_API_URL;
function Koleksi() {
  const { userSidebarCollapsed } = useSidebarLayout();
  const [searchParams, setSearchParams] = useSearchParams();
  const kategori = searchParams.get("kategori") || "Semua";
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [buku, setBuku] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 0
  });


  const fetchBooks = useCallback(async (page, searchValue, categoryValue) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "30",
        search: searchValue,
        kategori: categoryValue
      });
      const response = await fetch(`${API_URL}/api/buku?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil data buku");
      }

      if (!Array.isArray(data.data) || !data.pagination) {
        throw new Error("Format data buku dari server tidak valid");
      }

      setBuku(data.data);
      setPagination(data.pagination);
    } catch (fetchError) {
      console.error("Gagal mengambil data buku:", fetchError);
      setBuku([]);
      setPagination({ page, limit: 30, total: 0, totalPages: 0 });
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks(1, search, kategori);
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchBooks, search, kategori]);

  const handleCategoryChange = (nextCategory) => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.set("kategori", nextCategory);
      return nextParams;
    });
  };

  return (
    <div className="page-enter min-h-screen w-full overflow-x-hidden bg-[#f4f8fd] pb-24 md:pb-0">
      <Header />

      <div className="flex w-full items-start">
        <Sidebar />

        <main className={`min-w-0 flex-1 px-4 md:px-6 ${userSidebarCollapsed ? "md:ml-19.5" : "md:ml-64"}`}>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link to="/" className="text-sm font-medium text-[#7892ad] transition hover:text-[#315f92]">
                Kembali ke beranda
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-[#29465f]">Semua Koleksi Buku</h1>
              <p className="mb-6 mt-2 text-[#7892ad]">
                {pagination.total} buku ditemukan
              </p>
            </div>

            <SearchBar search={search} setSearch={setSearch} />
          </div>

          <CategoryFilter
            kategoriList={CATALOG_CATEGORIES}
            kategori={kategori}
            setKategori={handleCategoryChange}
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6 lg:grid-cols-5">
            {loading ? (
              <p className="col-span-full text-center text-gray-500">
                Memuat buku...
              </p>
            ) : error ? (
              <p className="col-span-full text-center text-red-600">{error}</p>
            ) : buku.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                Buku tidak ditemukan.
              </p>
            ) : (
              buku.map((item) => <BookCard key={item.id} buku={item} />)
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              disabled={loading || pagination.page <= 1}
              onClick={() =>
                fetchBooks(pagination.page - 1, search, kategori)
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sebelumnya
            </button>

            <span className="rounded-xl bg-[#315f92] px-4 py-2 text-sm font-semibold text-white">
              {pagination.totalPages === 0 ? 0 : pagination.page} / {pagination.totalPages}
            </span>

            <button
              disabled={
                loading ||
                pagination.page >= pagination.totalPages ||
                pagination.totalPages === 0
              }
              onClick={() =>
                fetchBooks(pagination.page + 1, search, kategori)
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </main>
      </div>

    </div>
  );
}

export default Koleksi;
