import { useEffect, useState } from "react";
import { BookOpen, Boxes, ClipboardList, Users } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import useSidebarLayout from "../contexts/useSidebarLayout";

function AdminDashboard() {
  const { adminSidebarCollapsed } = useSidebarLayout();

  const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/api/admin/dashboard`,
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
        setError(error.message || "Gagal memuat dashboard.");

      } finally {

        setLoading(false);

      }

    };

    fetchDashboard();

  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen bg-[#f4f8fd] ${adminSidebarCollapsed ? "md:ml-19.5" : "md:ml-58"}`}>
        <AdminSidebar />
        <main className="flex min-h-screen items-center justify-center p-6">
          <p className="text-sm font-medium text-[#7892ad]">Memuat dashboard...</p>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`min-h-screen bg-[#f4f8fd] ${adminSidebarCollapsed ? "md:ml-19.5" : "md:ml-58"}`}>
        <AdminSidebar />
        <main className="p-4 sm:p-6">
          <p role="alert" className="rounded-xl border border-[#f0d3d6] bg-[#fff6f7] p-4 text-sm text-[#b45f68]">
            {error || "Data dashboard tidak tersedia."}
          </p>
        </main>
      </div>
    );
  }

  const metrics = [
    { label: "Total buku", value: Number(data.totalBuku) || 0, icon: BookOpen, color: "bg-[#5b8fbd]" },
    { label: "Stok tersedia", value: Number(data.totalStock) || 0, icon: Boxes, color: "bg-[#70a98d]" },
    { label: "Pengguna", value: Number(data.totalPengguna) || 0, icon: Users, color: "bg-[#c89b59]" },
    { label: "Sedang dipinjam", value: Number(data.totalDipinjam) || 0, icon: ClipboardList, color: "bg-[#c9767c]" }
  ];
  const maxMetric = Math.max(...metrics.map((metric) => metric.value), 1);

  return (
    <div className={`page-enter min-h-screen bg-[#f4f8fd] pb-24 md:pb-6 ${adminSidebarCollapsed ? "md:ml-19.5" : "md:ml-58"}`}>
      <AdminSidebar />

      <main className="p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <header className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#7194b2]">HOKLibrary</p>
            <h1 className="mt-2 text-3xl font-bold text-[#29465f]">Dashboard Admin</h1>
            <p className="mt-2 text-sm text-[#7892ad]">Ringkasan koleksi dan aktivitas perpustakaan.</p>
          </header>

          <section aria-label="Statistik perpustakaan" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map(({ label, value, icon: Icon }, index) => (
              <article key={label} className="page-enter rounded-2xl border border-[#d9e6f1] bg-white p-5 shadow-[0_5px_20px_rgba(58,102,141,.06)]" style={{ animationDelay: `${index * 60}ms` }}>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-[#7892ad]">{label}</p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf4ff] text-[#4e7fab]">
                    <Icon size={19} />
                  </span>
                </div>
                <p className="mt-5 text-3xl font-bold tabular-nums text-[#29465f]">{value.toLocaleString("id-ID")}</p>
              </article>
            ))}
          </section>

          <section className="mt-6 rounded-2xl border border-[#d9e6f1] bg-white p-5 shadow-[0_5px_20px_rgba(58,102,141,.06)] sm:p-7">
            <div className="mb-7">
              <h2 className="text-lg font-bold text-[#29465f]">Ringkasan perpustakaan</h2>
              <p className="mt-1 text-sm text-[#7892ad]">Perbandingan jumlah buku, stok, pengguna, dan peminjaman aktif.</p>
            </div>

            <div role="img" aria-label="Diagram batang ringkasan perpustakaan" className="relative grid h-64 grid-cols-4 items-end gap-3 border-b border-l border-[#d9e6f1] px-3 pb-3 sm:gap-6 sm:px-6">
              {[25, 50, 75].map((line) => (
                <span key={line} className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[#e8eff6]" style={{ bottom: `${line}%` }} />
              ))}
              {metrics.map(({ label, value, color }) => {
                const barHeight = value === 0 ? 2 : Math.max((value / maxMetric) * 88, 6);
                return (
                  <div key={label} className="relative z-10 flex h-full min-w-0 flex-col items-center justify-end">
                    <span className="mb-2 text-xs font-bold tabular-nums text-[#456b8c]">{value.toLocaleString("id-ID")}</span>
                    <div className={`w-full max-w-16 rounded-t-lg ${color} transition-[height] duration-700`} style={{ height: `${barHeight}%` }} />
                    <span className="mt-3 min-h-8 text-center text-[10px] font-medium leading-4 text-[#7892ad] sm:text-xs">{label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {metrics.map(({ label, color }) => (
                <span key={label} className="inline-flex items-center gap-2 text-xs text-[#607b97]">
                  <span className={`h-2.5 w-2.5 rounded-sm ${color}`} />
                  {label}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;