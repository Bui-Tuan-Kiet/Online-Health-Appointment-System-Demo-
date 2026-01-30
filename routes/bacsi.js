// routes/bacsi.js
const express = require("express");
const router = express.Router();

let sql, poolPromise;

if (process.env.DEMO_MODE !== "true") {
  ({ sql, poolPromise } = require("../config"));
}


// ✅ GET danh sách bác sĩ (JOIN với Khoa)
router.get("/", async (req, res) => {
     if (process.env.DEMO_MODE === "true") {
    return res.json([
      {
        MaBacSi: 1,
        HoTen: "Demo Doctor",
        GioiTinh: "Nam",
        ChuyenKhoa: "Nội tổng quát",
        Email: "demo@hospital.com"
      }
    ]);
  }
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                b.MaBacSi, b.HoTen, b.GioiTinh, b.NgaySinh,
                b.SoDienThoai, b.KinhNghiem, b.Email,
                b.MaKhoa,
                k.Ten AS ChuyenKhoa
            FROM BacSi b
            LEFT JOIN Khoa k ON b.MaKhoa = k.MaKhoa
        `);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("❌ Lỗi khi lấy bác sĩ:", err);
        res.status(500).json({ error: "Lỗi khi lấy dữ liệu bác sĩ" });
    }
});

// ✅ Thêm bác sĩ
router.post("/", async (req, res) => {
    const { hoTen, gioiTinh, ngaySinh, chuyenKhoa, sdt, kinhNghiem, email } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("HoTen", sql.NVarChar(100), hoTen)
            .input("GioiTinh", sql.NVarChar(10), gioiTinh)
            .input("NgaySinh", sql.Date, new Date(ngaySinh))
            .input("MaKhoa", sql.Int, chuyenKhoa)
            .input("SoDienThoai", sql.NVarChar(20), sdt)
            .input("KinhNghiem", sql.NVarChar(50), kinhNghiem)
            .input("Email", sql.NVarChar(100), email)
            .query(`
                INSERT INTO BacSi (HoTen, GioiTinh, NgaySinh, MaKhoa, SoDienThoai, KinhNghiem, Email)
                VALUES (@HoTen, @GioiTinh, @NgaySinh, @MaKhoa, @SoDienThoai, @KinhNghiem, @Email)
            `);
        res.sendStatus(201);
    } catch (err) {
        console.error("❌ Lỗi thêm bác sĩ:", err);
        res.status(500).send("Lỗi khi thêm bác sĩ");
    }
});

// ✅ Cập nhật bác sĩ
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const { hoTen, gioiTinh, ngaySinh, chuyenKhoa, sdt, kinhNghiem, email } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("MaBacSi", sql.Int, id)
            .input("HoTen", sql.NVarChar(100), hoTen)
            .input("GioiTinh", sql.NVarChar(10), gioiTinh)
            .input("NgaySinh", sql.Date, new Date(ngaySinh))
            .input("MaKhoa", sql.Int, chuyenKhoa)
            .input("SoDienThoai", sql.NVarChar(20), sdt)
            .input("KinhNghiem", sql.NVarChar(50), kinhNghiem)
            .input("Email", sql.NVarChar(100), email)
            .query(`
                UPDATE BacSi
                SET HoTen = @HoTen, GioiTinh = @GioiTinh, NgaySinh = @NgaySinh,
                    MaKhoa = @MaKhoa, SoDienThoai = @SoDienThoai, KinhNghiem = @KinhNghiem, Email = @Email
                WHERE MaBacSi = @MaBacSi
            `);
        res.sendStatus(200);
    } catch (err) {
        console.error("❌ Lỗi cập nhật bác sĩ:", err);
        res.status(500).send("Lỗi khi cập nhật bác sĩ");
    }
});

// ✅ Xoá bác sĩ (nếu không có lịch khám liên quan)
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const pool = await poolPromise;

        // Kiểm tra có lịch khám không
        const check = await pool.request()
            .input("MaBacSi", sql.Int, id)
            .query("SELECT COUNT(*) AS Total FROM LichKham WHERE MaBacSi = @MaBacSi");

        if (check.recordset[0].Total > 0) {
            return res.status(400).json({ message: "Không thể xoá vì bác sĩ còn lịch khám!" });
        }

        // Nếu không bị ràng buộc thì xoá
        await pool.request()
            .input("MaBacSi", sql.Int, id)
            .query("DELETE FROM BacSi WHERE MaBacSi = @MaBacSi");

        res.status(200).json({ message: "Xoá bác sĩ thành công!" });
    } catch (err) {
        console.error("❌ Lỗi khi xoá bác sĩ:", err);
        res.status(500).json({ message: "Lỗi khi xoá bác sĩ", error: err.message });
    }
});

module.exports = router;
