import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function Peminjaman({ onSuccess }) {
    const { id: bukuId } = useParams();
    const [tanggalPinjam, setTanggalPinjam] = useState("");
    const [tanggalKembali, setTanggalKembali] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const handlerSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/peminjaman",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        buku_id: bukuId,
                        tanggal_pinjam: tanggalPinjam,
                        tanggal_kembali: tanggalKembali
                    })
                }
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal melakukan peminjaman");
            }

            setSuccess("Buku berhasil dipinjam")

            setTanggalPinjam("");
            setTanggalKembali("");

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
        <div className="min-h-screen flex bg-sky-50 p-6">
            <Sidebar/>

            <div className="mx-auto max-w-xl">
                <Link
                    to={`/buku/${bukuId}`}
                    className="px-4 py-2 flex gap-3 text-gray-700 hover:text-black"
                >
                    <ChevronLeft />
                    Kembali ke Detail Buku
                </Link>

                <h2>Pinjam Buku</h2>

                <form
                    onSubmit={handlerSubmit}
                    className="mt-4 space-y-4 bg-white p-6 rounded-xl"
                >

                    {/* inputan tanggal pinjam */}
                    <div>
                        <label htmlFor="" className="mb-2 block text-sm font-medium">
                            Tanggal pinjam 
                        </label>
                        
                        <input
                            type="date"
                            value={tanggalPinjam}
                            onChange={(event) => {
                                setTanggalPinjam(event.target.value)
                            }}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-black"
                            required
                        />
                    </div>

                    {/* tanggal kembali */}
                    <div>
                        <label htmlFor="" className="mb-2 block text-sm font-medium">
                            Tanggal kembali
                        </label>
                        
                        <input
                            type="date"
                            value={tanggalKembali}
                            onChange={(event) => {
                                setTanggalKembali(event.target.value)
                            }}
                            className="w-full mb-2 rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-black"
                            required
                        />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{ error }</div>
                        )}
                    
                    {/* Success */}
                    {success && (
                        <div className = "rounded-xl bg-green-50 p-3 text-sm text-green-600">
                            {success}
                        </div>
                    )}

                        {/* button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 rounded-xl bg-sky-500 px-4 py-3 font-medium text-white transition hover:bg-sky-400 disabled:opacity-50"
                        >
                            {loading
                                ? "memproses..."
                                : "Ajukan peminjaman buku"
                            }
                        </button>
                    
                </form>
            </div>
        </div>
    )
}