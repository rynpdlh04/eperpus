const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

const express = require('express');
const bukuRoutes = require('./routes/bukuRoutes');
const peminjamanRoutes = require('./routes/peminjamanRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminBukuRoutes = require("./routes/adminBukuRoutes");
const adminPeminjamanRoutes = require("./routes/adminPeminjamanRoutes");

const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.use(
  "/api/admin/peminjaman",
  adminPeminjamanRoutes
);
app.use("/api/admin/buku", adminBukuRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/buku', bukuRoutes);
app.use('/api/peminjaman', peminjamanRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({
        message: "backend berhasil berjalan"
    });
});


app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});