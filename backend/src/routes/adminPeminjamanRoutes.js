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

router.put(
  "/:id/kembalikan",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const connection = await db.getConnection();

    try {
      const { id } = req.params;

      await connection.beginTransaction();

      // Cari data peminjaman
      const [peminjaman] = await connection.query(
        `SELECT *
         FROM peminjaman
         WHERE id = ?
         FOR UPDATE`,
        [id]
      );

      if (peminjaman.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          message: "Data peminjaman tidak ditemukan"
        });
      }

      const dataPeminjaman = peminjaman[0];

      // Cek apakah sudah dikembalikan
      if (dataPeminjaman.status === "dikembalikan") {
        await connection.rollback();

        return res.status(400).json({
          message: "Buku sudah dikembalikan"
        });
      }

      // Ubah status peminjaman
      await connection.query(
        `UPDATE peminjaman
         SET status = 'dikembalikan'
         WHERE id = ?`,
        [id]
      );

      // Tambahkan stock buku
      await connection.query(
        `UPDATE buku
         SET stock = stock + 1
         WHERE id = ?`,
        [dataPeminjaman.buku_id]
      );

      await connection.commit();

      res.json({
        message: "Buku berhasil dikembalikan"
      });

    } catch (error) {
      await connection.rollback();

      console.error(error);

      res.status(500).json({
        message: "Gagal mengembalikan buku"
      });

    } finally {
      connection.release();
    }
  }
);


module.exports = router;