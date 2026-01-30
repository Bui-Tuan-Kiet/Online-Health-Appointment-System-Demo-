// routes/benhnhan.js
const express = require("express");
const router = express.Router();

let sql, poolPromise;

if (process.env.DEMO_MODE !== "true") {
  ({ sql, poolPromise } = require("../config"));
}


// ✅ GET tất cả bệnh nhân
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM BenhNhan');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("❌ Lỗi lấy danh sách bệnh nhân:", err);
        res.status(500).json({ error: "Lỗi khi lấy danh sách bệnh nhân" });
    }
});

// ✅ Thêm bệnh nhân
router.post('/', async (req, res) => {
    const { HoTen, Email, SoDienThoai, DiaChi, GioiTinh, BenhAn, Tuoi, ChieuCao, CanNang } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('HoTen', sql.NVarChar(100), HoTen)
            .input('Email', sql.NVarChar(100), Email)
            .input('SoDienThoai', sql.NVarChar(20), SoDienThoai)
            .input('DiaChi', sql.NVarChar(255), DiaChi)
            .input('GioiTinh', sql.NVarChar(10), GioiTinh)
            .input('BenhAn', sql.NVarChar(sql.MAX), BenhAn)
            .input('Tuoi', sql.Int, Tuoi)
            .input('ChieuCao', sql.Decimal(5,2), ChieuCao)
            .input('CanNang', sql.Decimal(5,2), CanNang)
            .query(`
                INSERT INTO BenhNhan (HoTen, Email, SoDienThoai, DiaChi, GioiTinh, BenhAn, Tuoi, ChieuCao, CanNang)
                VALUES (@HoTen, @Email, @SoDienThoai, @DiaChi, @GioiTinh, @BenhAn, @Tuoi, @ChieuCao, @CanNang)
            `);
        res.sendStatus(201);
    } catch (err) {
        console.error("❌ Lỗi thêm bệnh nhân:", err);
        res.status(500).send("Lỗi khi thêm bệnh nhân");
    }
});

// ✅ Cập nhật bệnh nhân
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { HoTen, Email, SoDienThoai, DiaChi, GioiTinh, BenhAn, Tuoi, ChieuCao, CanNang } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('MaBenhNhan', sql.Int, id)
            .input('HoTen', sql.NVarChar(100), HoTen)
            .input('Email', sql.NVarChar(100), Email)
            .input('SoDienThoai', sql.NVarChar(20), SoDienThoai)
            .input('DiaChi', sql.NVarChar(255), DiaChi)
            .input('GioiTinh', sql.NVarChar(10), GioiTinh)
            .input('BenhAn', sql.NVarChar(sql.MAX), BenhAn)
            .input('Tuoi', sql.Int, Tuoi)
            .input('ChieuCao', sql.Decimal(5,2), ChieuCao)
            .input('CanNang', sql.Decimal(5,2), CanNang)
            .query(`
                UPDATE BenhNhan SET HoTen=@HoTen, Email=@Email, SoDienThoai=@SoDienThoai, DiaChi=@DiaChi,
                GioiTinh=@GioiTinh, BenhAn=@BenhAn, Tuoi=@Tuoi, ChieuCao=@ChieuCao, CanNang=@CanNang
                WHERE MaBenhNhan=@MaBenhNhan
            `);
        res.sendStatus(200);
    } catch (err) {
        console.error("❌ Lỗi cập nhật bệnh nhân:", err);
        res.status(500).send("Lỗi khi cập nhật bệnh nhân");
    }
});

// ✅ Xoá bệnh nhân
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('MaBenhNhan', sql.Int, id)
            .query('DELETE FROM BenhNhan WHERE MaBenhNhan = @MaBenhNhan');
        res.status(200).json({ message: "Xoá bệnh nhân thành công!" });
    } catch (err) {
        console.error("❌ Lỗi xoá bệnh nhân:", err);
        res.status(500).json({ error: "Lỗi khi xoá bệnh nhân" });
    }
});

module.exports = router;
