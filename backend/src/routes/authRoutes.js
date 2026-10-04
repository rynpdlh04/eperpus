const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {
  try {

    const {
      nama,
      email,
      password
    } = req.body;

    // Validasi
    if (!nama || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password wajib diisi"
      });
    }

    // Cek apakah email sudah digunakan
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "Email sudah terdaftar"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Simpan user
    const [result] = await db.query(
      `INSERT INTO users
      (nama, email, password)
      VALUES (?, ?, ?)`,
      [
        nama,
        email,
        hashedPassword
      ]
    );

    res.status(201).json({
      message: "Registrasi berhasil",
      userId: result.insertId
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registrasi gagal"
    });

  }
});

router.post("/login", async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email dan password wajib diisi"
            });
        }

        const [users] = await db.query(
            `SELECT * FROM users WHERE email = ?`, [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Email atau password salah"
            })
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        )

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Email atau password yang anda masukkan salah"
            })
        }

        if (!process.env.JWT_SECRET) {
          throw new Error("JWT_SECRET belum dikonfigurasi");
        }

      const token = jwt.sign({
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role
      },
        process.env.JWT_SECRET, {
        expiresIn: "1d"
      }
      );

      res.json({
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          role: user.role
        }
      })

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Login gagal"
      });
    }
})

// GET user yang sedang login
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, nama, email, role, created_at FROM
      users
      WHERE id = ?
      `, [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "Pengguna tidak ditemukan"
      })
    }

    res.json({
      user: users[0]
    })

  } catch (error) {
    console.error(error);
    
    res.status(500).json({
      message: "gagal mengambil data user"
    })
  }
})

module.exports = router;