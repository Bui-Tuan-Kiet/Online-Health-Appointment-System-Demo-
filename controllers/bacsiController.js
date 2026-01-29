// File: routes/bacsi.js
const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Cấu hình kết nối SQL Server (Windows Authentication)
const config = {
  server: 'KENWAY', // hoặc localhost
  database: 'QLKhamBenh',
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  },
  authentication: {
    type: 'ntlm',
    options: {
      domain: '', // nếu có domain nội bộ
      userName: '',
      password: ''
    }
  }
};
router.get('/danhsach', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`
      SELECT 
        b.MaBacSi, b.HoTen, b.GioiTinh, b.NgaySinh, 
        k.Ten AS TenKhoa,
        b.SoDienThoai, b.KinhNghiem, b.Email
      FROM BacSi b
      LEFT JOIN Khoa k ON b.MaKhoa = k.MaKhoa
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi khi truy vấn BacSi:', err);
    res.status(500).json({ error: 'Lỗi khi truy xuất dữ liệu' });
  }
});

module.exports = router;
