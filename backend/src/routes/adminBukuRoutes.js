const express = require("express");

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

            const [rows] = await db.query(
                `SELECT *
                 FROM buku
                 ORDER BY id DESC`
            );

            res.json(rows);

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


            if (existingBook.length > 0) {

                return res.status(409).json({
                    message: "Kode buku sudah digunakan"
                });

            }


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


            // Cek kode buku digunakan buku lain
            const [duplicateCode] = await db.query(
                `SELECT id
                 FROM buku
                 WHERE kode_buku = ?
                 AND id != ?`,
                [kode_buku, id]
            );


            if (duplicateCode.length > 0) {

                return res.status(409).json({
                    message: "Kode buku sudah digunakan oleh buku lain"
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
        "SELECT id FROM buku WHERE id = ?",
        [id]
      );

      if (books.length === 0) {
        return res.status(404).json({
          message: "Buku tidak ditemukan"
        });
      }

      const coverPath =
        `/uploads/${req.file.filename}`;

      await db.query(
        `UPDATE buku
         SET cover = ?
         WHERE id = ?`,
        [coverPath, id]
      );

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