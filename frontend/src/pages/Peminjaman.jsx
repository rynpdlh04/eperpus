import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, X } from "lucide-react";

const LOAN_DURATIONS = [7, 14, 30];

export default function Peminjaman({ bukuId, bukuJudul, onClose, onSuccess }) {
    const [durasiHari, setDurasiHari] = useState(14);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const API_URL = import.meta.env.VITE_API_URL;
    const tanggalPinjam = new Date();
    tanggalPinjam.setHours(0, 0, 0, 0);
    const tanggalKembali = new Date(tanggalPinjam);
    tanggalKembali.setDate(tanggalKembali.getDate() + durasiHari);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !loading) onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [loading, onClose]);

    const handlerSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/peminjaman`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        buku_id: bukuId,
                        tanggal_pinjam: formatTanggalApi(tanggalPinjam),
                        tanggal_kembali: formatTanggalApi(tanggalKembali)
                    })
                }
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal melakukan peminjaman");
            }

            setSuccess(data.message || "Buku berhasil dipinjam.");

            if (typeof onSuccess === "function") {
                onSuccess(data);
            }

        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-[#29465f]/35 px-4 py-6 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="loan-dialog-title"
                className="page-enter w-full max-w-lg overflow-hidden rounded-2xl border border-[#d9e6f1] bg-white shadow-[0_24px_70px_rgba(41,70,95,.24)]"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 border-b border-[#e8eff6] px-5 py-4 sm:px-6">
                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[.12em] text-[#7194b2]">Peminjaman buku</p>
                        <h2 id="loan-dialog-title" className="mt-1 truncate text-lg font-bold text-[#29465f]">
                            {bukuJudul || "Pilih durasi pinjaman"}
                        </h2>
                    </div>
                    <button
                        type="button"
                        aria-label="Tutup dialog"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg p-2 text-[#7892ad] transition-colors hover:bg-[#f1f6fb] hover:text-[#315f92] disabled:opacity-50"
                    >
                        <X size={19} />
                    </button>
                </div>

                {success ? (
                    <div className="px-5 py-7 text-center sm:px-6">
                        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#edf8f1] text-[#4d8762]">
                            <CheckCircle2 size={25} />
                        </span>
                        <p role="status" className="mt-4 text-sm font-semibold text-[#4d8762]">{success}</p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-6 rounded-lg bg-[#5b8fbd] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4e7fab]"
                        >
                            Selesai
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handlerSubmit} className="space-y-5 px-5 py-5 sm:px-6">
                        <fieldset>
                            <legend className="text-sm font-semibold text-[#405b75]">Lama peminjaman</legend>
                            <div className="mt-3 grid grid-cols-3 gap-2">
                                {LOAN_DURATIONS.map((duration) => (
                                    <button
                                        key={duration}
                                        type="button"
                                        aria-pressed={durasiHari === duration}
                                        onClick={() => setDurasiHari(duration)}
                                        className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${durasiHari === duration ? "border-[#5b8fbd] bg-[#eaf4ff] text-[#315f92]" : "border-[#d7e4f0] bg-white text-[#7892ad] hover:bg-[#f7faff]"}`}
                                    >
                                        {duration} hari
                                    </button>
                                ))}
                            </div>
                        </fieldset>

                        <div className="flex items-start gap-3 rounded-xl bg-[#f4f8fd] p-4">
                            <CalendarDays size={18} className="mt-0.5 shrink-0 text-[#5b8fbd]" />
                            <div className="min-w-0 text-sm">
                                <p className="text-[#7892ad]">Tanggal kembali</p>
                                <p className="mt-1 font-semibold text-[#29465f]">
                                    {tanggalKembali.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                </p>
                            </div>
                            <Clock3 size={16} className="ml-auto mt-0.5 shrink-0 text-[#93a8bc]" />
                        </div>

                        {error && (
                            <p role="alert" className="rounded-xl border border-[#f0d3d6] bg-[#fff6f7] px-4 py-3 text-sm text-[#b45f68]">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-end gap-3 border-t border-[#e8eff6] pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="rounded-lg border border-[#d7e4f0] px-4 py-2.5 text-sm font-semibold text-[#607b97] transition-colors hover:bg-[#f4f8fd] disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-[#5b8fbd] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4e7fab] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? "Mengajukan..." : "Ajukan pinjaman"}
                            </button>
                        </div>
                    </form>
                )}
            </section>
        </div>
    );
}

function formatTanggalApi(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}