const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      parseInt(req.query.limit) || 30,
      30
    );

    const search = (req.query.search || "").trim();
    const kategori = (req.query.kategori || "").trim();

    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];

    // Search
    if (search) {
      whereConditions.push(`
        (
          judul LIKE ?
          OR penulis LIKE ?
          OR kode_buku LIKE ?
        )
      `);

      const searchValue = `%${search}%`;

      params.push(
        searchValue,
        searchValue,
        searchValue
      );
    }

    // Filter kategori
    if (kategori && kategori !== "Semua") {
      whereConditions.push("kategori = ?");
      params.push(kategori);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Hitung total data
    const [countRows] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM buku
      ${whereClause}
      `,
      params
    );

    const total = countRows[0].total;

    // Ambil buku sesuai halaman
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
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM buku WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Buku tidak ditemukan' });
        }

        res.json(rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data buku' });
     }
})
module.exports = router;