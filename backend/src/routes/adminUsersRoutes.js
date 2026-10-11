const express = require("express");

const db = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// GET semua pengguna
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT
          id,
          nama,
          email,
          role,
          created_at
        FROM users
        ORDER BY id DESC
      `);

      res.json(rows);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Gagal mengambil data pengguna"
      });
    }
  }
);

router.put(
  "/:id/role",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // Validasi role
      if (!["admin", "user"].includes(role)) {
        return res.status(400).json({
          message: "Role harus admin atau user"
        });
      }

      // Cek apakah user ada
      const [users] = await db.query(
        "SELECT id, role FROM users WHERE id = ?",
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          message: "Pengguna tidak ditemukan"
        });
      }

      // Jangan izinkan admin mengubah role dirinya sendiri
      if (Number(id) === Number(req.user.id)) {
        return res.status(400).json({
          message: "Anda tidak dapat mengubah role akun sendiri"
        });
      }

      // Update role
      await db.query(
        "UPDATE users SET role = ? WHERE id = ?",
        [role, id]
      );

      res.json({
        message: "Role pengguna berhasil diubah",
        role
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Gagal mengubah role pengguna"
      });
    }
  }
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Jangan hapus akun sendiri
      if (Number(id) === Number(req.user.id)) {
        return res.status(400).json({
          message: "Anda tidak dapat menghapus akun sendiri"
        });
      }

      // Cek apakah user ada
      const [users] = await db.query(
        "SELECT id, nama, role FROM users WHERE id = ?",
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          message: "Pengguna tidak ditemukan"
        });
      }

      const user = users[0];

      // Cek apakah user memiliki riwayat peminjaman
      const [peminjaman] = await db.query(
        `SELECT COUNT(*) AS total
         FROM peminjaman
         WHERE user_id = ?`,
        [id]
      );

      if (peminjaman[0].total > 0) {
        return res.status(400).json({
          message:
            "Pengguna tidak dapat dihapus karena memiliki riwayat peminjaman"
        });
      }

      // Hapus user
      await db.query(
        "DELETE FROM users WHERE id = ?",
        [id]
      );

      res.json({
        message: `Pengguna ${user.nama} berhasil dihapus`
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Gagal menghapus pengguna"
      });
    }
  }
);


module.exports = router;