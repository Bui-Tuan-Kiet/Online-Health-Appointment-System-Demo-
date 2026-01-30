const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config();

const isDemoMode = process.env.DEMO_MODE === "true";

let sql, poolPromise;

if (!isDemoMode) {
  ({ sql, poolPromise } = require("./config"));
  console.log("✅ Running with REAL database");
} else {
  console.log("⚠️ Running in DEMO MODE (NO database)");
}


const app = express();

app.use(cors());
app.use(bodyParser.json());
const bacsiRoutes = require("./routes/bacsi");
app.use("/api/bacsi", bacsiRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});


// 🌟 Lấy toàn bộ bệnh nhân (READ)
app.get('/api/benhnhan', async (req, res) => {
     if (isDemoMode) {
        return res.json([
            { MaBenhNhan: 1, HoTen: "BN Demo", SoDienThoai: "0123" }
        ]);
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM BenhNhan');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🌟 Thêm bệnh nhân mới (CREATE)
app.post('/api/benhnhan', async (req, res) => {
      if (isDemoMode) {
    return res.json({
      message: "Demo mode: Appointment submitted successfully (no database)."
    });
  }
    try {
        const { HoTen, Email, SoDienThoai, DiaChi } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input('HoTen', sql.NVarChar(100), HoTen)
            .input('Email', sql.NVarChar(100), Email)
            .input('SoDienThoai', sql.NVarChar(20), SoDienThoai)
            .input('DiaChi', sql.NVarChar(255), DiaChi)
            .query('INSERT INTO BenhNhan (HoTen, Email, SoDienThoai, DiaChi) VALUES (@HoTen, @Email, @SoDienThoai, @DiaChi)');
        res.json({ message: 'Thêm bệnh nhân thành công!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🌟 Cập nhật bệnh nhân (UPDATE)
app.put('/api/benhnhan/:id', async (req, res) => {
      if (isDemoMode) {
        return res.json({
            message: "Demo mode: Cập nhật bệnh nhân (giả lập)"
        });
    }

    try {
        const MaBenhNhan = req.params.id;
        const { HoTen, Email, SoDienThoai, DiaChi } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input('MaBenhNhan', sql.Int, MaBenhNhan)
            .input('HoTen', sql.NVarChar(100), HoTen)
            .input('Email', sql.NVarChar(100), Email)
            .input('SoDienThoai', sql.NVarChar(20), SoDienThoai)
            .input('DiaChi', sql.NVarChar(255), DiaChi)
            .query(`UPDATE BenhNhan SET HoTen=@HoTen, Email=@Email, SoDienThoai=@SoDienThoai, DiaChi=@DiaChi WHERE MaBenhNhan=@MaBenhNhan`);
        res.json({ message: 'Cập nhật bệnh nhân thành công!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🌟 Xóa bệnh nhân (DELETE)
app.delete('/api/benhnhan/:id', async (req, res) => {
    if (isDemoMode) {
        return res.json({
            message: "Demo mode: Xóa bệnh nhân (giả lập)"
        });
    }
    try {
        const MaBenhNhan = req.params.id;
        const pool = await poolPromise;
        await pool.request()
            .input('MaBenhNhan', sql.Int, MaBenhNhan)
            .query('DELETE FROM BenhNhan WHERE MaBenhNhan=@MaBenhNhan');
        res.json({ message: 'Xóa bệnh nhân thành công!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post('/api/dangkykham', async (req, res) => {
      if (isDemoMode) {
    return res.json({
      message: "Demo mode: Appointment submitted successfully (no database)."
    });
  }
    try {
        const { hoTen, tuoi, ngayKham, gioHen, trieuChung, email, soDienThoai } = req.body;
        const pool = await poolPromise;

        const parsedTuoi = parseInt(tuoi);
        const parsedNgayHen = new Date(ngayKham);

        // ✅ CHÍNH XÁC NHẤT: Tạo Date có giờ/phút từ chuỗi "16:00"
        const [hour, minute] = gioHen.split(':');
        const parsedGioHen = new Date(1970, 0, 1, parseInt(hour), parseInt(minute));

        console.log("📥 Dữ liệu nhận được:", { hoTen, parsedTuoi, parsedNgayHen, parsedGioHen, email, soDienThoai });

        await pool.request()
            .input('TenBenhNhan', sql.NVarChar(100), hoTen)
            .input('SoDienThoai', sql.NVarChar(20), soDienThoai)
            .input('Email', sql.NVarChar(100), email)
            .input('Tuoi', sql.Int, parsedTuoi)
            .input('NgayHen', sql.DateTime, parsedNgayHen)
            .input('GioHen', sql.Time, parsedGioHen) // ✅ Truyền đúng dạng Date chứa giờ
            .input('MaBenhNhan', sql.Int, null)
            .input('MaNhanVien', sql.Int, null)
            .input('MaDichVu', sql.Int, null)            
            .input('TrieuChung', sql.NVarChar(500), trieuChung)
            .input('NgayDangKy', sql.DateTime, new Date())
            .input('TrangThai', sql.NVarChar(20), 'Chờ xác nhận')
            .query(`
                INSERT INTO DangKyKham 
                (TenBenhNhan, SoDienThoai, Email, Tuoi, NgayHen, GioHen, TrieuChung, NgayDangKy, TrangThai)
                VALUES 
                (@TenBenhNhan, @SoDienThoai, @Email, @Tuoi, @NgayHen, @GioHen, @TrieuChung, @NgayDangKy, @TrangThai)
            `);

        res.status(200).json({ message: 'Đặt lịch thành công!' });

    } catch (err) {
        console.error("❌ Lỗi khi xử lý API /api/dangkykham:", err);
        res.status(500).json({ message: 'Lỗi khi đặt lịch!', error: err.message });
    }
});

app.post('/api/dangky', async (req, res) => {
      if (isDemoMode) {
    return res.json({
      message: "Demo mode: Appointment submitted successfully (no database)."
    });
  }
    try {
        const { tenDangNhap, matKhau, email, soDienThoai } = req.body;
        const pool = await poolPromise;

        // Kiểm tra tài khoản đã tồn tại chưa
        const check = await pool.request()
            .input('TenDangNhap', sql.NVarChar(50), tenDangNhap)
            .input('Email', sql.NVarChar(100), email)
            .query(`SELECT * FROM TaiKhoan WHERE TenDangNhap = @TenDangNhap OR Email = @Email`);

        if (check.recordset.length > 0) {
            return res.status(400).json({ success: false, message: 'Tên đăng nhập hoặc Email đã tồn tại!' });
        }

        // Thêm tài khoản mới
        await pool.request()
            .input('TenDangNhap', sql.NVarChar(50), tenDangNhap)
            .input('MatKhau', sql.NVarChar(100), matKhau)
            .input('Email', sql.NVarChar(100), email)
            .input('SoDienThoai', sql.NVarChar(20), soDienThoai)
            .input('BenhNhanId', sql.Int, null)
            .input('BacSiId', sql.Int, null)
            .input('NhanVienYTeId', sql.Int, null)
            .input('QuanLyBenhVienId', sql.Int, null)
            .query(`
                INSERT INTO TaiKhoan (TenDangNhap, MatKhau, Email, SoDienThoai, BenhNhanId, BacSiId, NhanVienYTeId, QuanLyBenhVienId)
                VALUES (@TenDangNhap, @MatKhau, @Email, @SoDienThoai, @BenhNhanId, @BacSiId, @NhanVienYTeId, @QuanLyBenhVienId)
            `);

        res.status(200).json({ success: true, message: 'Đăng ký thành công!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi server khi đăng ký!' });
    }
});
app.get('/api/bacsi/full', async (req, res) => {
      if (isDemoMode) {
        return res.json([
            {
                MaBacSi: 1,
                HoTen: "BS Demo Full",
                GioiTinh: "Nam",
                NgaySinh: "1980-01-01",
                SoDienThoai: "0123456789",
                KinhNghiem: "10 năm",
                Email: "demo@hospital.com",
                TenKhoa: "Nội tổng quát"
            }
        ]);
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                b.MaBacSi, b.HoTen, b.GioiTinh, b.NgaySinh,
                b.SoDienThoai, b.KinhNghiem, b.Email,
                k.Ten AS TenKhoa
            FROM BacSi b
            LEFT JOIN Khoa k ON b.MaKhoa = k.MaKhoa
        `);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách bác sĩ (full):", err);
        res.status(500).json({ message: "Lỗi khi lấy danh sách bác sĩ" });
    }
});

// 🌟 GET tất cả bác sĩ
app.get('/api/bacsi', async (req, res) => {
      if (isDemoMode) {
        return res.json([
            { MaBacSi: 1, HoTen: "BS Demo 1", ChuyenKhoa: "Nội" },
            { MaBacSi: 2, HoTen: "BS Demo 2", ChuyenKhoa: "Ngoại" }
        ]);
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM BacSi');
        res.json(result.recordset);
    } catch (err) {
        console.error("❌ Lỗi GET bác sĩ:", err);
        res.status(500).json({ message: "Lỗi server khi lấy bác sĩ" });
    }
});

// 🌟 POST thêm bác sĩ
app.post('/api/bacsi', async (req, res) => {
      if (isDemoMode) {
    return res.json({
      message: "Demo mode: Appointment submitted successfully (no database)."
    });
  }
    try {
        const { hoTen, gioiTinh, ngaySinh, chuyenKhoa, sdt } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input("HoTen", sql.NVarChar(100), hoTen)
            .input("GioiTinh", sql.NVarChar(10), gioiTinh)
            .input("NgaySinh", sql.Date, new Date(ngaySinh))
            .input("ChuyenKhoa", sql.NVarChar(100), chuyenKhoa)
            .input("SoDienThoai", sql.NVarChar(20), sdt)
            .query("INSERT INTO BacSi (HoTen, GioiTinh, NgaySinh, ChuyenKhoa, SoDienThoai) VALUES (@HoTen, @GioiTinh, @NgaySinh, @ChuyenKhoa, @SoDienThoai)");
        res.status(200).json({ message: "Thêm bác sĩ thành công" });
    } catch (err) {
        console.error("❌ Lỗi POST bác sĩ:", err);
        res.status(500).json({ message: "Lỗi server khi thêm bác sĩ" });
    }
});

// 🌟 PUT cập nhật bác sĩ
app.put('/api/bacsi/:id', async (req, res) => {
    if (isDemoMode) {
        return res.json({
            message: "Demo mode: Cập nhật bác sĩ (giả lập)"
        });
    }
    try {
        const id = req.params.id;
        const { hoTen, gioiTinh, ngaySinh, chuyenKhoa, sdt } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input("MaBacSi", sql.Int, id)
            .input("HoTen", sql.NVarChar(100), hoTen)
            .input("GioiTinh", sql.NVarChar(10), gioiTinh)
            .input("NgaySinh", sql.Date, new Date(ngaySinh))
            .input("ChuyenKhoa", sql.NVarChar(100), chuyenKhoa)
            .input("SoDienThoai", sql.NVarChar(20), sdt)
            .query(`UPDATE BacSi SET HoTen = @HoTen, GioiTinh = @GioiTinh, NgaySinh = @NgaySinh, ChuyenKhoa = @ChuyenKhoa, SoDienThoai = @SoDienThoai WHERE MaBacSi = @MaBacSi`);
        res.status(200).json({ message: "Cập nhật bác sĩ thành công" });
    } catch (err) {
        console.error("❌ Lỗi PUT bác sĩ:", err);
        res.status(500).json({ message: "Lỗi server khi cập nhật bác sĩ" });
    }
});

// 🌟 DELETE xoá bác sĩ
app.delete('/api/bacsi/:id', async (req, res) => {
     if (isDemoMode) {
        return res.json({
            message: "Demo mode: Xóa bác sĩ (giả lập)"
        });
    }
    try {
        const id = req.params.id;
        const pool = await poolPromise;
        await pool.request()
            .input("MaBacSi", sql.Int, id)
            .query("DELETE FROM BacSi WHERE MaBacSi = @MaBacSi");
        res.status(200).json({ message: "Xoá bác sĩ thành công" });
    } catch (err) {
        console.error("❌ Lỗi DELETE bác sĩ:", err);
        res.status(500).json({ message: "Lỗi server khi xoá bác sĩ" });
    }
});

