import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, BookOpen, CheckCircle2, MapPin, Calendar, Hash, Building2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AdminSidebar from "../components/AdminSidebar";
import Peminjaman from "./Peminjaman";
import useSidebarLayout from "../contexts/useSidebarLayout";
const API_URL = import.meta.env.VITE_API_URL;
export default function DetailBuku() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "admin";
    const sidebarLayout = useSidebarLayout();
    const collapsed = isAdmin
        ? sidebarLayout.adminSidebarCollapsed
        : sidebarLayout.userSidebarCollapsed;
    const [showPeminjaman, setShowPeminjaman] = useState(false);
    const [buku, setBuku] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        const controller = new AbortController();

        const fetchBuku = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `${API_URL}/api/buku/${id}`,
                    { signal: controller.signal }
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || data.error || "Buku tidak ditemukan."
                    );
                }

                setBuku(data);
            } catch (fetchError) {
                if (fetchError.name !== "AbortError") {
                    console.error("Gagal mengambil detail buku:", fetchError);
                    setError(fetchError.message || "Gagal memuat detail buku.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchBuku();

        return () => controller.abort();
    }, [id]);

    const posisiKonten = isAdmin
        ? collapsed ? "md:ml-19.5" : "md:ml-58"
        : collapsed ? "md:ml-19.5" : "md:ml-64";

    if (!buku) {
        return (
            <div className="page-enter min-h-screen overflow-x-hidden bg-[#f4f8fd] pb-24 md:pb-0">
                <Header admin={isAdmin} />
                {isAdmin ? <AdminSidebar /> : <Sidebar />}
                <main className={`min-h-screen px-4 py-6 pb-28 transition-all duration-300 sm:px-6 md:pb-6 ${posisiKonten}`}>
                    <div className="flex min-h-screen items-center justify-center px-6">
                        <div className="text-center">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#eaf4fb] text-[#5b8fbd]">
                                <BookOpen size={38} />
                            </div>
                            <p className="mt-4 text-sm text-[#687f92]">
                                {loading ? "Memuat detail buku..." : error || "Buku tidak ditemukan."}
                            </p>
                            <Link
                                to={isAdmin ? "/admin/buku" : "/"}
                                className="mt-6 inline-block rounded-xl bg-[#5b8fbd] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4e7fab]" >
                                Kembali
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="page-enter min-h-screen overflow-x-hidden bg-[#f4f8fd] pb-24 md:pb-0">
            <Header admin={isAdmin} />
            {isAdmin ? <AdminSidebar /> : <Sidebar />}

            <main className={`min-h-screen min-w-0 px-4 py-6 pb-28 transition-all duration-300 sm:px-6 md:pb-6 ${posisiKonten}`}>
                <div className="w-full min-w-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-5 flex items-center gap-2 text-sm font-medium text-[#5b8fbd] transition hover:text-[#29465f]"
                    >
                        <ChevronLeft size={19} />
                        Kembali
                    </button>

                    <div className="mb-6">
                        <h1 className="mt-1 text-3xl font-bold text-[#29465f]">Detail Buku</h1>
                        <p className="mt-1 text-sm text-[#8297aa]">
                            Informasi lengkap mengenai buku yang tersedia di perpustakaan.
                        </p>
                    </div>

                    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-[#deebf4] bg-white shadow-sm">
                        <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
                            <div className="flex min-h-110 items-center justify-center bg-[#eef6fc] p-6">
                                {buku.cover ? (
                                    <img
                                        src={buku.cover.startsWith("http") ? `${API_URL}${buku.cover}` : `${API_URL}${buku.cover}`}
                                        alt={`Cover ${buku.judul}`}
                                        className="h-87.5 w-56.25 rounded-2xl object-cover shadow-lg"
                                    />
                                ) : (
                                    <div className="flex h-87.5 w-56.25 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#cbddeb] bg-white text-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf4fb] text-[#5b8fbd]">
                                            <BookOpen size={32} />
                                        </div>
                                        <p className="mt-4 text-sm font-medium text-[#8297aa]">Cover belum tersedia</p>
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 p-6 lg:p-8">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-lg bg-sky-100 px-3 py-1.5 text-xs font-semibold text-[#5b8fbd]">
                                        {buku.kategori || "Lainnya"}
                                    </span>

                                    <span
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                                            Number(buku.stock) > 0
                                                ? "bg-[#edf8f1] text-[#5e9b72]"
                                                : "bg-[#fff0f0] text-[#d26d75]"
                                        }`}
                                    >
                                        <CheckCircle2 size={13} />
                                        {Number(buku.stock) > 0 ? "Tersedia" : "Stok Habis"}
                                    </span>
                                </div>

                                <h2 className="mt-5 wrap-break-word text-3xl font-bold leading-tight text-[#29465f]">
                                    {buku.judul}
                                </h2>

                                <p className="mt-2 text-base text-[#8297aa]">
                                    oleh <span className="font-semibold text-[#456b8c]">{buku.penulis}</span>
                                </p>

                                <div className="my-6 h-px bg-[#e7eff5]" />

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <InfoItem icon={<Hash size={17} />} label="Kode Buku" value={buku.kode_buku || "-"} />
                                    <InfoItem icon={<Building2 size={17} />} label="Penerbit" value={buku.penerbit || "-"} />
                                    <InfoItem icon={<Calendar size={17} />} label="Tahun Terbit" value={buku.tahun || buku.tahun_terbit || "-"} />
                                    <InfoItem icon={<BookOpen size={17} />} label="ISBN" value={buku.isbn || "-"} />
                                    <InfoItem icon={<Package size={17} />} label="Jumlah Stok" value={`${buku.stock || 0} buku`} />
                                    <InfoItem icon={<MapPin size={17} />} label="Lokasi Rak" value={buku.lokasi_rak || buku.lokasiRak || "-"} />
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-bold text-[#29465f]">Deskripsi</h3>
                                    <p className="mt-2 wrap-break-word leading-7 text-[#687f92]">
                                        {buku.deskripsi || "Belum ada deskripsi untuk buku ini."}
                                    </p>
                                </div>

                                {Number(buku.stock) > 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowPeminjaman(true)}
                                        className="mt-7 block w-full rounded-xl bg-[#5b8fbd] py-3.5 text-center font-semibold text-white shadow-sm transition hover:bg-[#4e7fab]"
                                    >
                                        Pinjam Buku
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="mt-7 w-full rounded-xl bg-[#edf1f4] py-3.5 font-semibold text-[#9aabb8]"
                                    >
                                        Stok Buku Habis
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {showPeminjaman && (
                <Peminjaman
                    bukuId={id}
                    bukuJudul={buku.judul}
                    onClose={() => setShowPeminjaman(false)}
                    onSuccess={() => {
                        setBuku((current) => current
                            ? { ...current, stock: Math.max(0, Number(current.stock) - 1) }
                            : current);
                    }}
                />
            )}
        </div>
    );
}

function InfoItem({ icon, label, value }) {
    return (
        <div className="min-w-0 rounded-xl border border-[#e4eef5] bg-[#f8fbfd] p-3.5">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eaf4fb] text-[#5b8fbd]">
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium text-[#91a5b5]">{label}</p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-[#29465f]">{value}</p>
                </div>
            </div>
        </div>
    );
}