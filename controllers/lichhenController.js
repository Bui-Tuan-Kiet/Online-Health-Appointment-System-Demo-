// controllers/lichhenController.js

const { poolPromise, sql } = require('../config');

// Lấy danh sách lịch khám
async function getAllAppointments(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM LichKham');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// Thêm lịch khám mới
async function createAppointment(req, res) {
    try {
        const {
            TenBacSi, Khoa, NgayCoTheKham, GioCoTheKham,
            PhongKham, ChanDoan, TrangThai,
            MaBenhNhan, MaNhanVien, MaBacSi
        } = req.body;

        const pool = await poolPromise;
        await pool.request()
            .input('TenBacSi', sql.NVarChar, TenBacSi)
            .input('Khoa', sql.NVarChar, Khoa)
            .input('NgayCoTheKham', sql.Date, NgayCoTheKham)
            .input('GioCoTheKham', sql.Time, GioCoTheKham)
            .input('PhongKham', sql.NVarChar, PhongKham)
            .input('ChanDoan', sql.NVarChar, ChanDoan)
            .input('TrangThai', sql.NVarChar, TrangThai)
            .input('MaBenhNhan', sql.Int, MaBenhNhan)
            .input('MaNhanVien', sql.Int, MaNhanVien)
            .input('MaBacSi', sql.Int, MaBacSi)
            .query(`
                INSERT INTO LichKham (TenBacSi, Khoa, NgayCoTheKham, GioCoTheKham,
                    PhongKham, ChanDoan, TrangThai, MaBenhNhan, MaNhanVien, MaBacSi)
                VALUES (@TenBacSi, @Khoa, @NgayCoTheKham, @GioCoTheKham,
                    @PhongKham, @ChanDoan, @TrangThai, @MaBenhNhan, @MaNhanVien, @MaBacSi)
            `);

        res.json({ message: "Thêm lịch khám thành công!" });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// Cập nhật lịch khám
async function updateAppointment(req, res) {
    try {
        const { id } = req.params;
        const {
            TenBacSi, Khoa, NgayCoTheKham, GioCoTheKham,
            PhongKham, ChanDoan, TrangThai,
            MaBenhNhan, MaNhanVien, MaBacSi
        } = req.body;

        const pool = await poolPromise;
        await pool.request()
            .input('MaLichKham', sql.Int, id)
            .input('TenBacSi', sql.NVarChar, TenBacSi)
            .input('Khoa', sql.NVarChar, Khoa)
            .input('NgayCoTheKham', sql.Date, NgayCoTheKham)
            .input('GioCoTheKham', sql.Time, GioCoTheKham)
            .input('PhongKham', sql.NVarChar, PhongKham)
            .input('ChanDoan', sql.NVarChar, ChanDoan)
            .input('TrangThai', sql.NVarChar, TrangThai)
            .input('MaBenhNhan', sql.Int, MaBenhNhan)
            .input('MaNhanVien', sql.Int, MaNhanVien)
            .input('MaBacSi', sql.Int, MaBacSi)
            .query(`
                UPDATE LichKham
                SET TenBacSi = @TenBacSi,
                    Khoa = @Khoa,
                    NgayCoTheKham = @NgayCoTheKham,
                    GioCoTheKham = @GioCoTheKham,
                    PhongKham = @PhongKham,
                    ChanDoan = @ChanDoan,
                    TrangThai = @TrangThai,
                    MaBenhNhan = @MaBenhNhan,
                    MaNhanVien = @MaNhanVien,
                    MaBacSi = @MaBacSi
                WHERE MaLichKham = @MaLichKham
            `);

        res.json({ message: "Cập nhật lịch khám thành công!" });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// Xoá lịch khám
async function deleteAppointment(req, res) {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        await pool.request()
            .input('MaLichKham', sql.Int, id)
            .query('DELETE FROM LichKham WHERE MaLichKham = @MaLichKham');

        res.json({ message: "Xoá lịch khám thành công!" });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    getAllAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
};
