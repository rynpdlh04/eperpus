const express = require("express");

const db = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ======================================
// GET SEMUA DATA PEMINJAMAN
// ======================================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {

      const [rows] = await db.query(`
        SELECT
          peminjaman.id,
          peminjaman.user_id,
          peminjaman.buku_id,
          peminjaman.nama_peminjam,
          peminjaman.tanggal_pinjam,
          peminjaman.tanggal_kembali,
          peminjaman.status,

          buku.judul,
          buku.kode_buku,
          buku.cover

        FROM peminjaman

        JOIN buku
          ON peminjaman.buku_id = buku.id

        ORDER BY peminjaman.id DESC
      `);

      res.json(rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Gagal mengambil data peminjaman"
      });

    }
  }
);


module.exports = router;