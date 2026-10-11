import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;
export default function BookCard({ buku }) {
    const coverUrl = buku.cover && /^(https?:|data:)/i.test(buku.cover)
        ? buku.cover
        : buku.cover
            ? `${API_URL}${buku.cover}`
            : "";

    return (
        <article className="min-w-0 overflow-hidden rounded-xl border border-[#dce7f1] bg-white shadow-[0_2px_10px_rgba(54,96,139,.045)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#bfd4e8] hover:shadow-[0_8px_22px_rgba(54,96,139,.09)] motion-reduce:transition-none">
            <div className="aspect-4/5 overflow-hidden bg-[#edf4fa]">
                {buku.cover ? (
                    <img
                        src={coverUrl}
                        alt={`Cover ${buku.judul}`}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-[#93a8bc]">
                        <BookOpen size={30} strokeWidth={1.6} />
                        <p className="mt-2 text-xs">
                            Preview cover belum tersedia
                        </p>
                    </div>
                )}
            </div>

            <div className="p-3.5 sm:p-4">
                <div className="min-h-12">
                    <h2 className="line-clamp-2 text-base font-bold leading-6 text-[#29465f] sm:text-lg">
                        {buku.judul}
                    </h2>
                </div>

                <p className="mt-1 text-sm text-[#7892ad]">
                    {buku.penulis}
                </p>

                <div className="mt-3 flex min-h-7 flex-wrap items-center justify-between gap-2">
                    <span className="rounded-md bg-[#edf4fb] px-2.5 py-1 text-[11px] font-semibold text-[#4e7fab]">
                        {buku.kategori || "Lainnya"}
                    </span>

                    <span className="text-xs tabular-nums text-[#7892ad]">
                        {buku.tahun || buku.tahun_terbit || "-"}
                    </span>
                </div>

                <Link
                    to={`/buku/${buku.id}`}
                    className="mt-3 block w-full rounded-lg border border-[#c5d8ec] py-2 text-center text-sm font-semibold text-[#4e7fab] transition-colors duration-150 hover:bg-[#eaf4ff] motion-reduce:transition-none"
                >
                    Lihat Detail
                </Link>
            </div>
        </article>
    );
}