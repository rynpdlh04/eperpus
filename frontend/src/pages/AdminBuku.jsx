import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ArrowLeft,
  X
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";

function AdminBuku() {

  const [buku, setBuku] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    judul: "",
    penulis: "",
    penerbit: "",
    tahun: "",
    kode_buku: "",
    kategori: "",
    deskripsi: "",
    stock: 0,
    cover: "" 
  });

  const [saving, setSaving] = useState(false);

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  const [editingBook, setEditingBook] = useState(null);

  // fungsi untuk menghandle perubahan cover
  const handleCoverChange = (event) => {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  setCoverFile(file);

  const previewUrl = URL.createObjectURL(file);

  setCoverPreview(previewUrl);
};

  // fungsi untuk menghandle perubahan
 const handleEdit = (book) => {
  setEditingBook(book);

  setCoverFile(null);

  setCoverPreview(
    book.cover
      ? getCoverUrl(book.cover)
      : ""
  );

  setFormData({
    judul: book.judul || "",
    penulis: book.penulis || "",
    penerbit: book.penerbit || "",
    tahun: book.tahun || "",
    kode_buku: book.kode_buku || "",
    kategori: book.kategori || "",
    deskripsi: book.deskripsi || "",
    stock: book.stock || 0,
    cover: book.cover || ""
    });
  };

  // fungsi untuk menghandle update
  
const handleUpdate = async (event) => {
  event.preventDefault();

  try {
    setSaving(true);

    const token = localStorage.getItem("token");

    // =========================
    // 1. UPDATE DATA BUKU
    // =========================

    const response = await fetch(
      `http://localhost:3000/api/admin/buku/${editingBook.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          tahun: Number(formData.tahun),
          stock: Number(formData.stock)
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Gagal memperbarui buku"
      );
    }

    // =========================
    // 2. UPLOAD COVER BARU
    // =========================

    if (coverFile) {

      const uploadData = new FormData();

      uploadData.append("cover", coverFile);

      const uploadResponse = await fetch(
        `http://localhost:3000/api/admin/buku/${editingBook.id}/cover`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: uploadData
        }
      );

      const uploadResult =
        await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadResult.message ||
          "Data berhasil diperbarui tetapi cover gagal diupload"
        );
      }
    }

    alert("Buku berhasil diperbarui");

    setEditingBook(null);

    setCoverFile(null);
    setCoverPreview("");

    setFormData({
      judul: "",
      penulis: "",
      penerbit: "",
      tahun: "",
      kode_buku: "",
      kategori: "",
      deskripsi: "",
      stock: 0,
      cover: ""
    });

    fetchBuku();

  } catch (error) {
    console.error(error);
    alert(error.message);

  } finally {
    setSaving(false);
  }
};
  
  const handleDelete = async (book) => {
  const yakin = window.confirm(
    `Apakah Anda yakin ingin menghapus buku "${book.judul}"?`
  );

  if (!yakin) {
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:3000/api/admin/buku/${book.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Gagal menghapus buku"
      );
    }

    alert("Buku berhasil dihapus");

    fetchBuku();

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  const fetchBuku = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/admin/buku",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengambil data buku"
        );
      }

      setBuku(data);

    } catch (error) {

      console.error(error);
      alert(error.message);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchBuku();
  }, []);


  // Filter pencarian
  const filteredBuku = buku.filter((item) => {

    const keyword = search.toLowerCase();

    return (
      item.judul?.toLowerCase().includes(keyword) ||
      item.penulis?.toLowerCase().includes(keyword) ||
      item.kode_buku?.toLowerCase().includes(keyword) ||
      item.kategori?.toLowerCase().includes(keyword)
    );

  });
    
    const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
    ...prev,
    [name]: value
    }));
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    setSaving(true);

    const token = localStorage.getItem("token");

    // =========================
    // 1. SIMPAN DATA BUKU
    // =========================

    const response = await fetch(
      "http://localhost:3000/api/admin/buku",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          tahun: Number(formData.tahun),
          stock: Number(formData.stock)
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Gagal menambahkan buku"
      );
    }

    // =========================
    // 2. UPLOAD COVER
    // =========================

    if (coverFile) {

      const uploadData = new FormData();

      uploadData.append("cover", coverFile);

      const uploadResponse = await fetch(
        `http://localhost:3000/api/admin/buku/${data.id}/cover`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: uploadData
        }
      );

      const uploadResult =
        await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadResult.message ||
          "Buku berhasil dibuat tetapi cover gagal diupload"
        );
      }
    }

    alert("Buku berhasil ditambahkan");

    setShowForm(false);

    setFormData({
      judul: "",
      penulis: "",
      penerbit: "",
      tahun: "",
      kode_buku: "",
      kategori: "",
      deskripsi: "",
      stock: 0,
      cover: ""
    });

    setCoverFile(null);
    setCoverPreview("");

    fetchBuku();

  } catch (error) {
    console.error(error);
    alert(error.message);

  } finally {
    setSaving(false);
  }
};

  const getCoverUrl = (cover) => {
  if (!cover) {
    return null;
  }

  if (cover.startsWith("http")) {
    return cover;
  }

  return `http://localhost:3000${cover}`;
  };  

  return (
    <div className="min-h-screen bg-sky-50 md:ml-64">

      <AdminSidebar />

      <main className="p-6">

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <Link
                to="/admin"
                className="mb-3 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={18} />
                Kembali ke Dashboard
              </Link>

              <h1 className="text-3xl font-bold">
                Kelola Buku
              </h1>

              <p className="mt-1 text-gray-500">
                Kelola koleksi buku perpustakaan.
              </p>

            </div>


            {/* Tombol tambah */}
            <button
              onClick={() => {
                setFormData({
                  judul: "",
                  penulis: "",
                  penerbit: "",
                  tahun: "",
                  kode_buku: "",
                  kategori: "",
                  deskripsi: "",
                  stock: 0,
                  cover: ""
                });

                setCoverFile(null);
                setCoverPreview("");

                setShowForm(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-400"
            >
              <Plus size={18} />
              Tambah Buku
            </button>

          </div>


          {/* SEARCH */}
          <div className="relative mt-8">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Cari judul, penulis, kode buku, atau kategori..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-sky-400"
            />

          </div>


          {/* JUMLAH DATA */}
          <div className="mt-4 text-sm text-gray-500">
            Menampilkan {filteredBuku.length} dari {buku.length} buku
          </div>


          {/* TABLE */}
          <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">

            {loading ? (

              <div className="p-10 text-center text-gray-500">
                Memuat data buku...
              </div>

            ) : filteredBuku.length === 0 ? (

              <div className="p-10 text-center text-gray-500">
                Buku tidak ditemukan.
              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead className="border-b bg-gray-50">

                    <tr>

                      <th className="px-5 py-4 text-sm font-semibold">
                        Buku
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold">
                        Kategori
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold">
                        Tahun
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold">
                        Stock
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold">
                        Aksi
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y">

                    {filteredBuku.map((item) => (

                      <tr
                        key={item.id}
                        className="transition hover:bg-gray-50"
                      >

                        {/* BUKU */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-4">

                            <div className="flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">

                              {item.cover ? (

                                <img
                                  src={getCoverUrl(item.cover)}
                                  alt={item.judul}
                                  className="h-full w-full object-cover"
                                />

                              ) : (

                                <span className="text-xl">
                                  📚
                                </span>

                              )}

                            </div>


                            <div>

                              <p className="font-semibold">
                                {item.judul}
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                {item.penulis}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {item.kode_buku}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* KATEGORI */}
                        <td className="px-5 py-4">

                          <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium">
                            {item.kategori}
                          </span>

                        </td>


                        {/* TAHUN */}
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {item.tahun}
                        </td>


                        {/* STOCK */}
                        <td className="px-5 py-4">

                          <span
                            className={`font-semibold ${
                              item.stock > 0
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {item.stock}
                          </span>

                        </td>


                        {/* AKSI */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <button
                              onClick={()=>handleEdit(item)}
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-sky-50 hover:text-sky-500"
                              title="Edit buku"
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              onClick={()=> handleDelete(item)}
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-500"
                              title="Hapus buku"
                            >
                              <Trash2 size={18} />
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

        </main>
        {showForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">

      {/* HEADER MODAL */}
      <div className="flex items-center justify-between border-b px-6 py-5">

        <div>
          <h2 className="text-xl font-bold">
            Tambah Buku
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Tambahkan koleksi buku baru.
          </p>
        </div>

        <button
          onClick={() => setShowForm(false)}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={20} />
        </button>

      </div>


      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-6"
      >

        {/* JUDUL */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Judul Buku
          </label>

          <input
            type="text"
            name="judul"
            value={formData.judul}
            onChange={handleChange}
            required
            placeholder="Contoh: Pemrograman JavaScript"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
          />
        </div>


        {/* PENULIS & PENERBIT */}
        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Penulis
            </label>

            <input
              type="text"
              name="penulis"
              value={formData.penulis}
              onChange={handleChange}
              required
              placeholder="Nama penulis"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Penerbit
            </label>

            <input
              type="text"
              name="penerbit"
              value={formData.penerbit}
              onChange={handleChange}
              required
              placeholder="Nama penerbit"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </div>

        </div>


        {/* TAHUN & KODE */}
        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Tahun
            </label>

            <input
              type="number"
              name="tahun"
              value={formData.tahun}
              onChange={handleChange}
              required
              placeholder="2026"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Kode Buku
            </label>

            <input
              type="text"
              name="kode_buku"
              value={formData.kode_buku}
              onChange={handleChange}
              required
              placeholder="BK001"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </div>

        </div>


        {/* KATEGORI & STOCK */}
        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Kategori
            </label>

            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
            >

              <option value="">
                Pilih kategori
              </option>

              <option value="Novel">
                Novel
              </option>

              <option value="Komik">
                Komik
              </option>

              <option value="Pelajaran">
                Pelajaran
              </option>

              <option value="Agama">
                Agama
              </option>

            </select>
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </div>

        </div>


        {/* DESKRIPSI */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Deskripsi
          </label>

          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows="4"
            placeholder="Masukkan deskripsi buku..."
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
          />
        </div>


        {/* COVER */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Cover Buku
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleCoverChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:font-medium file:text-sky-600 hover:file:bg-sky-100"
          />

          <p className="mt-1 text-xs text-gray-400">
            Format JPG, PNG, atau WEBP. Maksimal 2 MB.
          </p>

          {coverPreview && (
            <div className="mt-4">

              <p className="mb-2 text-sm font-medium">
                Preview Cover
              </p>

              <img
                src={coverPreview}
                alt="Preview cover"
                className="h-48 w-32 rounded-xl object-cover shadow-sm"
              />

            </div>
          )}
        </div>


        {/* BUTTON */}
        <div className="flex justify-end gap-3 border-t pt-5">

          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-medium text-white hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Buku"}
          </button>

        </div>

      </form>

    </div>

  </div>
      )}

  {editingBook && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b px-6 py-5">

        <div>
          <h2 className="text-xl font-bold">
            Edit Buku
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Perbarui informasi buku.
          </p>
        </div>

        <button
          onClick={() => setEditingBook(null)}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={20} />
        </button>

      </div>


      {/* FORM */}
      <form
        onSubmit={handleUpdate}
        className="space-y-5 p-6"
      >

        {/* JUDUL */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Judul Buku
          </label>

          <input
            type="text"
            name="judul"
            value={formData.judul}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
          />
        </div>


        {/* PENULIS & PENERBIT */}
        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Penulis
            </label>

            <input
              type="text"
              name="penulis"
              value={formData.penulis}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Penerbit
            </label>

            <input
              type="text"
              name="penerbit"
              value={formData.penerbit}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </div>

        </div>


        {/* TAHUN & KODE */}
        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Tahun
            </label>

            <input
              type="number"
              name="tahun"
              value={formData.tahun}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Kode Buku
            </label>

            <input
              type="text"
              name="kode_buku"
              value={formData.kode_buku}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </div>

        </div>


        {/* KATEGORI & STOCK */}
        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Kategori
            </label>

            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
            >

              <option value="">
                Pilih kategori
              </option>

              <option value="Novel">
                Novel
              </option>

              <option value="Komik">
                Komik
              </option>

              <option value="Pelajaran">
                Pelajaran
              </option>

              <option value="Agama">
                Agama
              </option>

            </select>
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </div>

        </div>


        {/* DESKRIPSI */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Deskripsi
          </label>

          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows="4"
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400"
          />
        </div>


        {/* COVER */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Cover Buku
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleCoverChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:font-medium file:text-sky-600 hover:file:bg-sky-100"
          />

          <p className="mt-1 text-xs text-gray-400">
            Pilih gambar baru jika ingin mengganti cover.
            Maksimal 2 MB.
          </p>

          {coverPreview && (
            <div className="mt-4">

              <p className="mb-2 text-sm font-medium">
                Preview Cover
              </p>

              <img
                src={coverPreview}
                alt="Preview cover"
                className="h-48 w-32 rounded-xl object-cover shadow-sm"
              />

            </div>
          )}
        </div>


        {/* BUTTON */}
        <div className="flex justify-end gap-3 border-t pt-5">

          <button
            type="button"
            onClick={() => setEditingBook(null)}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-medium text-white hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Menyimpan..."
              : "Simpan Perubahan"}
          </button>

        </div>

      </form>

    </div>

  </div>
)}      

    </div>
  );
}

export default AdminBuku;