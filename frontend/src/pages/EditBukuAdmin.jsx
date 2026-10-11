import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Image as ImageIcon, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { BOOK_CATEGORIES } from "../constants/bookCategories";
import useSidebarLayout from "../contexts/useSidebarLayout";

const API_URL = import.meta.env.VITE_API_URL;
const emptyForm = {
    judul: "",
    penulis: "",
    penerbit: "",
    tahun: "",
    kode_buku: "",
    kategori: "",
    deskripsi: "",
    stock: 0,
    cover: ""
};

function EditBukuAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { adminSidebarCollapsed: collapsed } = useSidebarLayout();
    const [formData, setFormData] = useState(emptyForm);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const controller = new AbortController();

        const fetchBook = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(`${API_URL}/api/buku/${id}`, {
                    signal: controller.signal
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || data.error || "Buku tidak ditemukan.");
                }

                setFormData({
                    judul: data.judul || "",
                    penulis: data.penulis || "",
                    penerbit: data.penerbit || "",
                    tahun: data.tahun || "",
                    kode_buku: data.kode_buku || "",
                    kategori: data.kategori || "",
                    deskripsi: data.deskripsi || "",
                    stock: data.stock ?? 0,
                    cover: data.cover || ""
                });
                setCoverPreview(getCoverUrl(data.cover));
            } catch (fetchError) {
                if (fetchError.name !== "AbortError") {
                    console.error("Gagal memuat buku:", fetchError);
                    setError(fetchError.message || "Gagal memuat data buku.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchBook();
        return () => controller.abort();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleCoverChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setError("Format cover harus JPG, PNG, atau WEBP.");
            event.target.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError("Ukuran cover maksimal 2 MB.");
            event.target.value = "";
            return;
        }

        setError("");
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/admin/buku/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    judul: formData.judul.trim(),
                    penulis: formData.penulis.trim(),
                    penerbit: formData.penerbit.trim(),
                    tahun: Number(formData.tahun),
                    kode_buku: formData.kode_buku.trim(),
                    stock: Number(formData.stock)
                })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal memperbarui buku.");
            }

            if (coverFile) {
                const uploadData = new FormData();
                uploadData.append("cover", coverFile);
                const uploadResponse = await fetch(
                    `${API_URL}/api/admin/buku/${id}/cover`,
                    {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                        body: uploadData
                    }
                );
                const uploadResult = await uploadResponse.json();

                if (!uploadResponse.ok) {
                    throw new Error(
                        `Data buku tersimpan, tetapi cover gagal diunggah: ${uploadResult.message || "Coba lagi."}`
                    );
                }
            }

            navigate("/admin/buku", { replace: true });
        } catch (saveError) {
            console.error("Gagal memperbarui buku:", saveError);
            setError(saveError.message || "Gagal memperbarui buku.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page-enter min-h-screen overflow-x-hidden bg-[#f4f8fd] text-[#29465f]">
            <AdminSidebar />

            <main
                className={`min-h-screen transition-[margin] duration-500 ${collapsed ? "md:ml-19.5" : "md:ml-58"}`}
            >
                <div className="px-4 py-6 pb-28 sm:px-7 sm:py-8 md:pb-8">
                    <div className="mx-auto max-w-350">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/buku")}
                            className="mb-5 flex items-center gap-2 text-sm font-medium text-[#7892ad] transition hover:text-[#315f92]"
                        >
                            <ArrowLeft size={18} />
                            Data Buku
                        </button>

                        <h1 className="text-3xl font-bold text-[#29465f]">Edit Buku</h1>
                        <p className="mb-7 mt-1 text-sm text-[#7892ad]">
                            Perbarui informasi dan sampul buku.
                        </p>

                        {error && (
                            <p role="alert" className="mb-5 rounded-xl border border-[#f0d3d6] bg-[#fff6f7] px-4 py-3 text-sm text-[#b45f68]">
                                {error}
                            </p>
                        )}

                        {loading ? (
                            <div className="rounded-2xl border border-[#d9e6f1] bg-white p-10 text-center text-[#7892ad]">
                                Memuat data buku...
                            </div>
                        ) : error && !formData.judul ? (
                            <button
                                type="button"
                                onClick={() => navigate("/admin/buku")}
                                className="rounded-xl bg-[#5b8fbd] px-5 py-3 text-sm font-semibold text-white"
                            >
                                Kembali ke data buku
                            </button>
                        ) : (
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
                                <section className="rounded-2xl border border-[#d9e6f1] bg-white p-5 shadow-[0_5px_20px_rgba(58,102,141,.06)] sm:p-7">
                                    <h2 className="mb-5 text-lg font-bold">Sampul Buku</h2>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex min-h-75 w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#cbdceb] bg-[#fbfdff] p-4 text-center sm:min-h-100"
                                    >
                                        {coverPreview ? (
                                            <img src={coverPreview} alt="Preview sampul buku" className="max-h-90 w-full object-contain" />
                                        ) : (
                                            <>
                                                <ImageIcon size={34} className="mb-4 text-[#5b8fbd]" />
                                                <span className="font-medium text-[#456b8c]">Pilih sampul buku</span>
                                                <span className="mt-1 text-xs text-[#8aa0b5]">JPG, PNG, atau WEBP, maksimal 2 MB</span>
                                            </>
                                        )}
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleCoverChange}
                                        className="hidden"
                                    />
                                </section>

                                <section className="rounded-2xl border border-[#d9e6f1] bg-white p-5 shadow-[0_5px_20px_rgba(58,102,141,.06)] sm:p-7">
                                    <h2 className="mb-5 text-lg font-bold">Informasi Buku</h2>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <Field label="Judul Buku" name="judul" value={formData.judul} onChange={handleChange} required />
                                        <Field label="Penulis" name="penulis" value={formData.penulis} onChange={handleChange} required />
                                        <Field label="Penerbit" name="penerbit" value={formData.penerbit} onChange={handleChange} required />
                                        <Field label="Tahun Terbit" name="tahun" type="number" value={formData.tahun} onChange={handleChange} required />
                                        <Field label="Kode Buku" name="kode_buku" value={formData.kode_buku} onChange={handleChange} required />
                                        <label className="block text-sm font-semibold">
                                            Kategori
                                            <select
                                                name="kategori"
                                                value={formData.kategori}
                                                onChange={handleChange}
                                                required
                                                className="mt-2 h-12 w-full rounded-xl border border-[#d7e4f0] bg-white px-4 text-sm font-normal outline-none focus:border-[#8bb3da] focus:ring-4 focus:ring-[#e7f1fb]"
                                            >
                                                <option value="">Pilih kategori</option>
                                                {BOOK_CATEGORIES.map((kategori) => (
                                                    <option key={kategori} value={kategori}>{kategori}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <Field label="Jumlah Stok" name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} required />
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold">
                                                Deskripsi
                                                <textarea
                                                    name="deskripsi"
                                                    value={formData.deskripsi}
                                                    onChange={handleChange}
                                                    rows="4"
                                                    className="mt-2 w-full resize-y rounded-xl border border-[#d7e4f0] px-4 py-3 text-sm font-normal outline-none focus:border-[#8bb3da] focus:ring-4 focus:ring-[#e7f1fb]"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </section>

                                <div className="flex justify-end gap-3 lg:col-span-2">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/admin/buku")}
                                        className="h-12 rounded-xl bg-[#e8eef4] px-6 text-sm font-semibold text-[#607080] hover:bg-[#dfe8f0]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex h-12 items-center gap-2 rounded-xl bg-[#5b8fbd] px-7 text-sm font-semibold text-white hover:bg-[#4e7fab] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Save size={18} />
                                        {saving ? "Menyimpan..." : "Simpan Perubahan"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function Field({ label, name, type = "text", value, onChange, required, min }) {
    return (
        <label className="block text-sm font-semibold">
            {label}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                min={min}
                className="mt-2 h-12 w-full rounded-xl border border-[#d7e4f0] bg-white px-4 text-sm font-normal outline-none focus:border-[#8bb3da] focus:ring-4 focus:ring-[#e7f1fb]"
            />
        </label>
    );
}

function getCoverUrl(cover) {
    if (!cover) return "";
    return cover.startsWith("http") ? cover : `${API_URL}${cover}`;
}

export default EditBukuAdmin;
