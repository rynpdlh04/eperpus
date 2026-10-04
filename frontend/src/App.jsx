import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

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

function Home() {
  const [buku, setBuku] = useState([]);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");

  const kategoriList = [
    "Semua", "Olahraga", "Seni", "Karya Umum", "Hiburan", "Agama" 
  ]

  useEffect(() => {
    fetch("http://localhost:3000/api/buku")
      .then((response) => response.json())
      .then((data) => {
        setBuku(data);
      })
      .catch((error) => {
        console.error("Gagal mengambil data buku:", error);
      });
  }, []);

  const filteredBuku = buku.filter((item) => {
    const keyword = search.toLowerCase();
    
    const cocokDenganSearch = 
      item.judul.toLowerCase().includes(keyword) ||
      item.penulis.toLowerCase().includes(keyword) ||
      item.kode_buku.toLowerCase().includes(keyword)
    
    const cocokDenganKategori =
      kategori === "Semua" ||
      item.kategori === kategori;
    
    return cocokDenganSearch && cocokDenganKategori
 })

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-sky-50 pb-20 md:pb-0">
      {/* ini header nih ya */}
      <Header />
      
      <div className="flex w-full items-start">

        <Sidebar />
        
        <main className="min-w-0 flex-1 px-4 sm:ml-64 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:align-baseline sm:justify-between mt-6">
            <div>
              <h2 className="mb-2 text-3xl font-bold">
                Koleksi Buku
              </h2>
              <p className="mb-6 text-gray-600">
                Jumlah Buku : {filteredBuku.length}
              </p>
          </div>
            <SearchBar
              search={search}
              setSearch={setSearch}
            />
          </div>

          

          <CategoryFilter
            kategoriList={kategoriList}
            kategori={kategori}
            setKategori={setKategori}
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6 lg:grid-cols-5">
            {filteredBuku.map((item) => (
              <BookCard key={item.id} buku={item} />
            ))}
          </div>
        </main>

      </div>
      <MobileBottomNav/>
    </div>
  );
}

function App() {
  return (

    // membutuhkan login
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
        path="/admin/peminjaman"
        element={
          <AdminRoute>
            <AdminPeminjaman />
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
  );
}


export default App;