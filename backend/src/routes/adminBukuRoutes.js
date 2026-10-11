const express = require("express");
const fs = require("fs");
const path = require("path");

const db = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../config/upload");


const router = express.Router();



// =====================================================
// GET SEMUA BUKU
// =====================================================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const page = Math.max(
        parseInt(req.query.page) || 1,
        1
      );

      const limit = Math.min(
        parseInt(req.query.limit) || 10,
        50
      );

      const search = (req.query.search || "").trim();

      const offset = (page - 1) * limit;

      let whereClause = "";
      let params = [];

      if (search) {
        whereClause = `
          WHERE
            judul LIKE ?
            OR penulis LIKE ?
            OR kode_buku LIKE ?
            OR kategori LIKE ?
        `;

        const searchValue = `%${search}%`;

        params = [
          searchValue,
          searchValue,
          searchValue,
          searchValue
        ];
      }

      // Hitung jumlah seluruh data yang sesuai pencarian
      const [countRows] = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM buku
        ${whereClause}
        `,
        params
      );

      const total = countRows[0].total;

      // Ambil data sesuai halaman
      const [rows] = await db.query(
        `
        SELECT *
        FROM buku
        ${whereClause}
        ORDER BY id DESC
        LIMIT ? OFFSET ?
        `,
        [...params, limit, offset]
      );

      const totalPages = Math.ceil(total / limit);

      res.json({
        data: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Gagal mengambil data buku"
      });
    }
  }
);


// =====================================================
// TAMBAH BUKU
// =====================================================

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const {
                judul,
                penulis,
                penerbit,
                tahun,
                kode_buku,
                kategori,
                deskripsi,
                stock,
                cover
            } = req.body;


            // Validasi data wajib
            if (
                !judul ||
                !penulis ||
                !penerbit ||
                !tahun ||
                !kode_buku ||
                !kategori
            ) {

                return res.status(400).json({
                    message: "Data buku wajib diisi"
                });

            }


            // Cek kode buku
            const [existingBook] = await db.query(
                `SELECT id
                 FROM buku
                 WHERE kode_buku = ?`,
                [kode_buku]
            );




            const [result] = await db.query(
                `INSERT INTO buku
                (
                    judul,
                    penulis,
                    penerbit,
                    tahun,
                    kode_buku,
                    kategori,
                    deskripsi,
                    stock,
                    cover
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    judul,
                    penulis,
                    penerbit,
                    tahun,
                    kode_buku,
                    kategori,
                    deskripsi || null,
                    stock || 0,
                    cover || null
                ]
            );


            res.status(201).json({
                message: "Buku berhasil ditambahkan",
                id: result.insertId
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Gagal menambahkan buku"
            });

        }

    }
);


// =====================================================
// EDIT BUKU
// =====================================================

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const { id } = req.params;

            const {
                judul,
                penulis,
                penerbit,
                tahun,
                kode_buku,
                kategori,
                deskripsi,
                stock,
                cover
            } = req.body;


            // Cek buku
            const [existingBook] = await db.query(
                `SELECT id
                 FROM buku
                 WHERE id = ?`,
                [id]
            );


            if (existingBook.length === 0) {

                return res.status(404).json({
                    message: "Buku tidak ditemukan"
                });

            }


            await db.query(
                `UPDATE buku
                 SET
                    judul = ?,
                    penulis = ?,
                    penerbit = ?,
                    tahun = ?,
                    kode_buku = ?,
                    kategori = ?,
                    deskripsi = ?,
                    stock = ?,
                    cover = ?
                 WHERE id = ?`,
                [
                    judul,
                    penulis,
                    penerbit,
                    tahun,
                    kode_buku,
                    kategori,
                    deskripsi || null,
                    stock || 0,
                    cover || null,
                    id
                ]
            );


            res.json({
                message: "Buku berhasil diperbarui"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Gagal memperbarui buku"
            });

        }

    }
);


// =====================================================
// HAPUS BUKU
// =====================================================

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const { id } = req.params;


            // Cek apakah buku ada
            const [existingBook] = await db.query(
                `SELECT id
                 FROM buku
                 WHERE id = ?`,
                [id]
            );


            if (existingBook.length === 0) {

                return res.status(404).json({
                    message: "Buku tidak ditemukan"
                });

            }


            await db.query(
                `DELETE FROM buku
                 WHERE id = ?`,
                [id]
            );


            res.json({
                message: "Buku berhasil dihapus"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Gagal menghapus buku"
            });

        }

    }
);


router.post(
  "/:id/cover",
  authMiddleware,
  adminMiddleware,
  upload.single("cover"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          message: "File cover wajib dipilih"
        });
        }
        
    const [books] = await db.query(
        "SELECT id, cover FROM buku WHERE id = ?",
        [id]
        );
        
      if (books.length === 0) {
        return res.status(404).json({
          message: "Buku tidak ditemukan"
        });
        }
        
    const oldCover = books[0].cover;

      const coverPath =
        `/uploads/${req.file.filename}`;

      await db.query(
        `UPDATE buku
         SET cover = ?
         WHERE id = ?`,
        [coverPath, id]
      );

        if (oldCover && oldCover.startsWith("/uploads/")) {
        const oldFilePath = path.join(
            __dirname,
            "../../",
            oldCover
        );

        if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
        }
        }
        
      res.json({
        message: "Cover berhasil diupload",
        cover: coverPath
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Gagal mengupload cover"
      });
    }
  }
);

module.exports = router;