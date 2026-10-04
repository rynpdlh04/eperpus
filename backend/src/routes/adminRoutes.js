const express = require("express");

const db = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
    "/test",
    authMiddleware,
    adminMiddleware,
    (req, res) => {
        res.json({
            message: "Akses admin berhasil",
            user: req.user
        })
    }
);

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const [totalBuku] = await db.query(
                `SELECT COUNT(*) AS total FROM buku`
            );

            const [totalStock] = await db.query(
                `SELECT COALESCE(SUM(stock), 0) AS total FROM buku`
            );

            const [totalPengguna] = await db.query(
                `SELECT COUNT(*) AS total FROM users`
            );

            const [totalDipinjam] = await db.query(
                `SELECT COUNT(*) AS total FROM peminjaman
                WHERE status = 'dipinjam'
                `
            );

            const [totalPeminjaman] = await db.query(
                `SELECT COUNT(*) AS total FROM peminjaman`
            );

            res.json({
                totalBuku: totalBuku[0].total,
                totalStock: totalStock[0].total,
                totalPengguna: totalPengguna[0].total,
                totalDipinjam: totalDipinjam[0].total
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Gagal memuat data"
            })
        }
    }
)

router.get(
    "/buku",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const [books] = await db.query(
                `SELECT * FROM buku ORDER BY id DESC`
            );

            res.json(books);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Gagal mengambil data buku"
            });
        }
    }
);

module.exports = router;