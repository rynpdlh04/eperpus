import { useRef, useState } from "react";
import { ArrowLeft, Image as ImageIcon, Upload, Save, ChevronDown, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { BOOK_CATEGORIES } from "../constants/bookCategories";
import useSidebarLayout from "../contexts/useSidebarLayout";

function TambahBukuAdmin() {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { adminSidebarCollapsed: collapsed } = useSidebarLayout();
    const [dropdownKategori, setDropdownKategori] = useState(false);
    const [coverPreview, setCoverPreview] = useState("");
    const [coverFile, setCoverFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [popup, setPopup] = useState({
        tampil: false,
        tipe: "",
        judul: "",
        pesan: ""
    });
    const [formData, setFormData] = useState({
        judul: "",
        penulis: "",
        penerbit: "",
        tahun: "",
        kode_buku: "",
        kategori: "",
        stock: "",
        deskripsi: ""
    });

    const tampilkanPopup = (tipe, judul, pesan) => {
        setPopup({ tampil: true, tipe, judul, pesan });
    };

    const tutupPopup = () => {
        setPopup({ tampil: false, tipe: "", judul: "", pesan: "" });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            e.target.value = "";
            setCoverFile(null);
            tampilkanPopup("error", "File Tidak Valid", "File yang dipilih harus berupa gambar.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            e.target.value = "";
            setCoverFile(null);
            tampilkanPopup("error", "Ukuran File Terlalu Besar", "Ukuran gambar maksimal 2 MB.");
            return;
        }

        setCoverFile(file);
        const reader = new FileReader();
        reader.onload = (event) => setCoverPreview(event.target.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/admin/buku`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    judul: formData.judul.trim(),
                    penulis: formData.penulis.trim(),
                    penerbit: formData.penerbit.trim(),
                    tahun: Number(formData.tahun),
                    kode_buku: formData.kode_buku.trim(),
                    kategori: formData.kategori,
                    stock: Number(formData.stock),
                    deskripsi: formData.deskripsi.trim()
                })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal menambahkan buku.");
            }

            if (coverFile) {
                const uploadData = new FormData();
                uploadData.append("cover", coverFile);
                const uploadResponse = await fetch(
                    `${API_URL}/api/admin/buku/${data.id}/cover`,
                    {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                        body: uploadData
                    }
                );
                const uploadResult = await uploadResponse.json();

                if (!uploadResponse.ok) {
                    throw new Error(
                        `Buku berhasil disimpan, tetapi cover gagal diunggah: ${uploadResult.message || "Silakan unggah cover melalui edit buku."}`
                    );
                }
            }

            tampilkanPopup("success", "Berhasil Disimpan", "Buku berhasil ditambahkan ke koleksi perpustakaan.");
        } catch (error) {
            console.error("Gagal menambahkan buku:", error);
            tampilkanPopup("error", "Gagal Menyimpan", error.message || "Tidak dapat terhubung ke server.");
        } finally {
            setSaving(false);
        }
    };

    const handlePopupOke = () => {
        if (popup.tipe === "success") {
            navigate("/admin/buku");
            return;
        }

        tutupPopup();
    };

    return (
        <div className="page-enter min-h-screen overflow-x-hidden bg-[#f4f8fd] text-[#29465f]">
                <AdminSidebar />

            <main
                className={`min-h-screen transition-[margin] duration-500 ${collapsed ? "md:ml-19.5" : "md:ml-58"}`}
            >
                <div className="px-7 py-8">
                    <div className="mx-auto max-w-350">
                        <div className="mb-7">
                            <button type="button" onClick={() => navigate("/admin/buku")} className="mb-5 flex items-center gap-2 text-sm font-medium text-[#7892ad] transition hover:-translate-x-1 hover:text-[#4e7fab]">
                                <ArrowLeft size={18} />
                                Data Buku
                            </button>

                            <h1 className="text-[32px] font-bold tracking-tight text-[#29465f]">Tambah Buku</h1>
                            <p className="mt-1 text-[15px] text-[#7892ad]">Isi informasi buku yang akan ditambahkan ke koleksi perpustakaan.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[385px_1fr]">
                                <div className="rounded-2xl border border-[#d9e6f1] bg-white p-7 shadow-[0_5px_20px_rgba(58,102,141,.06)]">
                                    <h2 className="mb-5 text-lg font-bold">Sampul Buku</h2>

                                    <div onClick={() => fileInputRef.current?.click()} className="group flex h-113.75 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#cbdceb] bg-[#fbfdff]">
                                        {coverPreview ? (
                                            <div className="relative h-full w-full">
                                                <img src={coverPreview} alt="Preview sampul buku" className="h-full w-full object-contain p-5" />
                                                <div className="absolute inset-x-5 bottom-5 flex justify-center">
                                                    <span className="rounded-xl bg-[#5b8fbd] px-5 py-2.5 text-sm font-semibold text-white shadow-lg">Ganti Foto</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf5fc] text-[#5b8fbd]">
                                                    <ImageIcon size={32} />
                                                </div>

                                                <p className="text-base font-medium text-[#456b8c]">Unggah sampul buku</p>
                                                <p className="mt-1 text-xs text-[#8aa0b5]">JPG/PNG, maksimal 2 MB</p>

                                                <span className="mt-6 flex items-center gap-2 rounded-xl bg-[#5b8fbd] px-6 py-3 text-sm font-semibold text-white">
                                                    <Upload size={17} />
                                                    Pilih File
                                                </span>
                                            </>
                                        )}

                                        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCoverChange} className="hidden" />
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-[#d9e6f1] bg-white p-7 shadow-[0_5px_20px_rgba(58,102,141,.06)]">
                                    <h2 className="mb-5 text-lg font-bold">Informasi Buku</h2>

                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <Field label="Judul Buku" name="judul" value={formData.judul} onChange={handleChange} placeholder="Masukkan judul buku" required />
                                        <Field label="Penulis" name="penulis" value={formData.penulis} onChange={handleChange} placeholder="Masukkan nama penulis" required />

                                        <div className="relative">
                                            <label className="mb-2 block text-sm font-semibold">
                                                Kategori <span className="text-[#d26d75]">*</span>
                                            </label>

                                            <button type="button" onClick={() => setDropdownKategori((prev) => !prev)} className="flex h-12 w-full items-center justify-between rounded-xl border border-[#d7e4f0] bg-white px-4 text-left text-sm">
                                                <span className={formData.kategori ? "font-medium text-[#29465f]" : "text-[#8ba0b4]"}>
                                                    {formData.kategori || "Pilih kategori"}
                                                </span>
                                                <ChevronDown size={18} />
                                            </button>

                                            {dropdownKategori && (
                                                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-[#d7e4f0] bg-white shadow-lg">
                                                    {BOOK_CATEGORIES.map((item) => (
                                                        <button key={item} type="button" onClick={() => { setFormData((prev) => ({ ...prev, kategori: item })); setDropdownKategori(false); }} className="block w-full px-4 py-3 text-left text-sm text-[#607b97] hover:bg-[#f5faff]">
                                                            {item}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <Field label="Penerbit" name="penerbit" value={formData.penerbit} onChange={handleChange} placeholder="Masukkan nama penerbit" required />
                                        <Field label="Tahun Terbit" name="tahun" type="number" value={formData.tahun} onChange={handleChange} placeholder="Contoh: 2024" required />
                                        <Field label="Kode Buku" name="kode_buku" value={formData.kode_buku} onChange={handleChange} placeholder="Contoh: BK001" required />
                                        <Field label="Jumlah Stok" name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Masukkan jumlah stok" min="0" required />

                                        <div className="md:col-span-2">
                                            <label className="mb-2 block text-sm font-semibold">Deskripsi</label>
                                            <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows="4" placeholder="Tulis deskripsi buku..." className="w-full resize-none rounded-xl border border-[#d7e4f0] px-4 py-3 text-sm outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex justify-end gap-4">
                                <button type="button" onClick={() => navigate("/admin/buku")} className="h-12 rounded-xl bg-[#edf0f3] px-10 text-sm font-semibold text-[#607080]">Batal</button>
                                <button type="submit" disabled={saving} className="flex h-12 items-center gap-2 rounded-xl bg-[#5b8fbd] px-8 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                                    <Save size={18} />
                                    {saving ? "Menyimpan..." : "Simpan Buku"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            {popup.tampil && (
                <div className="fixed inset-0 z-300 flex items-center justify-center bg-[#29465f]/30 px-4 backdrop-blur-[3px]">
                    <div className="w-full max-w-97.5 rounded-3xl bg-white p-7 text-center shadow-[0_20px_60px_rgba(41,70,95,.2)]">
                        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${popup.tipe === "success" ? "bg-[#edf7f0]" : "bg-[#fff0f1]"}`}>
                            <div className={`flex h-11 w-11 items-center justify-center rounded-full ${popup.tipe === "success" ? "bg-[#d9f0df] text-[#4d9a68]" : "bg-[#f9dfe2] text-[#d26d75]"}`}>
                                {popup.tipe === "success" ? <CheckCircle size={23} /> : <XCircle size={23} />}
                            </div>
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-[#29465f]">{popup.judul}</h2>
                        <p className="mt-2 text-sm leading-6 text-[#8297aa]">{popup.pesan}</p>

                        <button type="button" onClick={handlePopupOke} className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold text-white transition ${popup.tipe === "success" ? "bg-[#5b8fbd] hover:bg-[#4e7fab]" : "bg-[#d26d75] hover:bg-[#c35d66]"}`}>
                            Oke
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function Field({ label, name, type = "text", value, onChange, placeholder, required, min }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold">
                {label} {required && <span className="text-[#d26d75]">*</span>}
            </label>
            <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} min={min} className="h-12 w-full rounded-xl border border-[#d7e4f0] bg-white px-4 text-sm outline-none" />
        </div>
    );
}

export default TambahBukuAdmin;