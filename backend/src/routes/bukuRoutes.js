const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM buku');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data buku' });
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