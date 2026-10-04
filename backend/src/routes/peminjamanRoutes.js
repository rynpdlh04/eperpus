const express = require("express");
const db = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    const connection = await db.getConnection(); 
    try {
            const {
        buku_id,
        tanggal_pinjam,
        tanggal_kembali
    } = req.body;

    // validasi input
    if (!buku_id ||
        !tanggal_pinjam ||
        !tanggal_kembali
    ) {
        res.status(400).json({
            message: "Semua data peminjaman wajib diisi"
        })
    }

    // mengambil user id dari JWT
    const userId = req.user.id;

    // memulai transaksi
    await connection.beginTransaction();

    // ambil data user
    const [users] = await connection.query(
        `SELECT id, nama
        FROM users WHERE id = ?`,
        [userId]
    );

    if (users.length === 0) {
        await connection.rollback();

        return res.status(404).json({
            message: "User tidak ditemukan"
        })
    }

    const user = users[0];

    // ambil data buku
    const [buku] = await connection.query(
        `SELECT *
        FROM buku WHERE id = ?
        FOR UPDATE`,
        [buku_id]
    );

    if (buku.length === 0) {
        await connection.rollback();

        return res.status(404).json(
            {
                message: "Data buku tidak ditemukan"
            }
        )
    };

    const dataBuku = buku[0];

    // cek stok bukunya dulu
    if (dataBuku.stock <= 0) {
        await connection.rollback();
        return res.status(401).json({
            message: "Stok buku sedang kosong"
        })
    }

    // simpan data peminjaman
    const [result] = await connection.query(
        `INSERT INTO peminjaman
        (
            user_id,
            buku_id,
            nama_peminjam,
            tanggal_pinjam,
            tanggal_kembali
        )
        VALUES (?,?,?,?,?)`,
        [userId, buku_id, user.nama, tanggal_pinjam, tanggal_kembali]
    );

    // kurangi stok
    await connection.query(
        `UPDATE buku
        SET stock = stock - 1
        WHERE id = ?`,
        [buku_id]
    );

    // simpan transaksi
    await connection.commit();

    res.status(201).json({
        message: "Berhasil melakukan peminjaman buku",
        id: result.insertId
    })
    } catch (error) {
        await connection.rollback();

        console.error(error);
        res.status(500).json({
            message: "Gagal melakukan peminjaman buku"
        })
    } finally {
        connection.release();
    }
})

// GET semua peminjaman
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await db.query(
            `SELECT
                peminjaman.id,
                peminjaman.user_id,
                peminjaman.nama_peminjam,
                peminjaman.tanggal_pinjam,
                peminjaman.tanggal_kembali,
                peminjaman.status,
                buku.id AS buku_id,
                buku.judul,
                buku.kode_buku
            FROM peminjaman
            JOIN buku
                ON peminjaman.buku_id = buku.id
            WHERE peminjaman.user_id = ?
            ORDER BY peminjaman.id DESC
            `, [userId]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Gagal mengambil data peminjaman"
        });
    }
});

// Taro lagi buku di database
router.put("/:id/kembalikan", authMiddleware, async (req, res) => {
  const connection = await db.getConnection();

    try {
        const { id } = req.params;
        const userId = req.user.id;

    // Mulai transaction
    await connection.beginTransaction();

    // Ambil data peminjaman
    const [peminjaman] = await connection.query(
      `SELECT *
       FROM peminjaman
       WHERE id = ?
       AND user_id = ?
       FOR UPDATE`,
      [id, userId]
    );

    // Cek apakah peminjaman ditemukan
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

    // Simpan perubahan
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
});

module.exports = router;