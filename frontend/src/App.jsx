import { useCallback, useEffect, useState } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";

import BookCard from "./components/BookCard";
import SearchBar from "./components/SearchBar";
import Header from "./components/Header";
import CategoryFilter from "./components/CategoryFilter";
import Peminjaman from "./pages/Peminjaman.jsx"
import DetailBuku from "./pages/DetailBuku";
import Sidebar from "./components/Sidebar.jsx";
import MobileBottomNav from "./components/MobileBottomNav.jsx";
import RiwayatPeminjaman from "./pages/RiwayatPeminjaman";
import Login  from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBuku from "./pages/AdminBuku";
import AdminRoute from "./components/AdminRoute";
import AdminPeminjaman from "./pages/AdminPeminjaman";
import AdminUsers from "./pages/AdminUsers";
import Koleksi from "./pages/Koleksi";
import TambahBukuAdmin from "./pages/TambahBukuAdmin";
import EditBukuAdmin from "./pages/EditBukuAdmin";
import { CATALOG_CATEGORIES } from "./constants/bookCategories";
import SidebarLayoutProvider from "./components/SidebarLayoutProvider";
import useSidebarLayout from "./contexts/useSidebarLayout";
const API_URL = import.meta.env.VITE_API_URL;
  
function Home() {
  const { userSidebarCollapsed } = useSidebarLayout();
  const [buku, setBuku] = useState([]);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalBuku, setTotalBuku] = useState(0);


  const fetchBooks = useCallback(async (searchValue, categoryValue) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "5",
        search: searchValue,
        kategori: categoryValue
      });
      const response = await fetch(
        `${API_URL}:3000/api/buku?${params}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil data buku");
      }

      if (!Array.isArray(data.data) || !data.pagination) {
        throw new Error("Format data buku dari server tidak valid");
      }

      setBuku(data.data);
      setTotalBuku(data.pagination.total);
    } catch (fetchError) {
      console.error("Gagal mengambil data buku:", fetchError);
      setBuku([]);
      setTotalBuku(0);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks(search, kategori);
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchBooks, search, kategori]);

  return (
    <div className="page-enter min-h-screen w-full overflow-x-hidden bg-[#f4f8fd] pb-24 md:pb-0">
      {/* ini header nih ya */}
      <Header />
      
      <div className="flex w-full items-start">

        <Sidebar />
        
        <main className={`min-w-0 flex-1 px-4 md:px-6 ${userSidebarCollapsed ? "md:ml-19.5" : "md:ml-64"}`}>
          <div className="mx-auto max-w-7xl">
            <section className="mb-7 mt-8 flex flex-col gap-2 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#7194b2]">Koleksi pilihan</p>
                <h2 className="mt-2 text-3xl font-bold text-[#29465f]">Koleksi Buku</h2>
                <p className="mt-2 text-sm text-[#7892ad]">
                  Menampilkan {buku.length} pilihan dari {totalBuku.toLocaleString("id-ID")} buku.
                </p>
              </div>
              <div className="w-full lg:max-w-md">
                <SearchBar search={search} setSearch={setSearch} />
              </div>
            </section>

            <section aria-label="Filter dan pintasan koleksi" className="mb-7 border-b border-[#d9e6f1] pb-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <CategoryFilter
                  kategoriList={CATALOG_CATEGORIES}
                  kategori={kategori}
                  setKategori={setKategori}
                />
                <Link
                  to={`/koleksi?${new URLSearchParams({ kategori, search })}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#5b8fbd] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#4e7fab] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8fbd]"
                >
                  Lihat semua buku
                </Link>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {loading ? (
              <p className="col-span-full text-center text-gray-500">
                Memuat buku...
              </p>
            ) : error ? (
              <p className="col-span-full text-center text-red-600">
                {error}
              </p>
            ) : buku.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                Buku tidak ditemukan.
              </p>
            ) : (
              buku.map((item) => <BookCard key={item.id} buku={item} />)
            )}
          </div>
          </div>
        </main>

      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const showMobileNav = !["/login", "/register"].includes(location.pathname);

  return (
    <SidebarLayoutProvider>
      <div className={showMobileNav ? "flex h-dvh flex-col md:block md:h-auto" : ""}>
        <div className={showMobileNav ? "min-h-0 flex-1 overflow-y-auto md:min-h-screen md:overflow-visible" : ""}>
        <Routes>
    <Route
      path="/"
        element={
          <ProtectedRoutes>
            <Home/>
        </ProtectedRoutes>
      }
    />

    <Route
      path="/koleksi"
      element={
        <ProtectedRoutes>
          <Koleksi />
        </ProtectedRoutes>
      }
    />

    <Route
      path="/buku/:id"
        element={
          <ProtectedRoutes>
            <DetailBuku/>
        </ProtectedRoutes>
      }
    />

    <Route
      path="/peminjaman/:id"
        element={
          <ProtectedRoutes>
            <Peminjaman/>
        </ProtectedRoutes>
      }  
    />  
      
    <Route
        path="/riwayat"
      element={
        <ProtectedRoutes>
          <RiwayatPeminjaman/>
        </ProtectedRoutes>
      }  
      /> 

    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/buku"
      element={
        <AdminRoute>
          <AdminBuku />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/buku/tambah"
      element={
        <AdminRoute>
          <TambahBukuAdmin />
        </AdminRoute>
      }
    />

    <Route
      path="/admin/buku/:id/edit"
      element={
        <AdminRoute>
          <EditBukuAdmin />
        </AdminRoute>
      }
    />
      
      <Route
        path="/admin/peminjaman"
        element={
          <AdminRoute>
            <AdminPeminjaman />
          </AdminRoute>
        }
      />

      <Route
      path="/admin/users"
      element={
        <AdminRoute>
          <AdminUsers />
        </AdminRoute>
      }
    />


    {/* tanpa membutuhkan login */}
    <Route
        path="/login"
        element={
          <PublicRoute>
            <Login/>
        </PublicRoute>
      }  
      />

    <Route
        path="/register"
        element={
          <PublicRoute>
            <Register/>
          </PublicRoute>
        }
      />

        </Routes>
        </div>
        {showMobileNav && <MobileBottomNav />}
      </div>
    </SidebarLayoutProvider>
  );
}


export default App;