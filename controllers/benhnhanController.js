const { poolPromise, sql } = require('../config');

exports.getAllBenhNhan = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM BenhNhan');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getBenhNhanById = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaBenhNhan', sql.Int, req.params.id)
            .query('SELECT * FROM BenhNhan WHERE MaBenhNhan = @MaBenhNhan');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createBenhNhan = async (req, res) => {
    const { HoTen, Email, SoDienThoai, DiaChi, GioiTinh, BenhAn, Tuoi, ChieuCao, CanNang } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('HoTen', sql.NVarChar, HoTen)
            .input('Email', sql.NVarChar, Email)
            .input('SoDienThoai', sql.NVarChar, SoDienThoai)
            .input('DiaChi', sql.NVarChar, DiaChi)
            .input('GioiTinh', sql.NVarChar, GioiTinh)
            .input('BenhAn', sql.NVarChar(sql.MAX), BenhAn)
            .input('Tuoi', sql.Int, Tuoi)
            .input('ChieuCao', sql.Decimal(5,2), ChieuCao)
            .input('CanNang', sql.Decimal(5,2), CanNang)
            .query(`
                INSERT INTO BenhNhan (HoTen, Email, SoDienThoai, DiaChi, GioiTinh, BenhAn, Tuoi, ChieuCao, CanNang)
                VALUES (@HoTen, @Email, @SoDienThoai, @DiaChi, @GioiTinh, @BenhAn, @Tuoi, @ChieuCao, @CanNang)
            `);
        res.json({ message: 'Thêm bệnh nhân thành công!' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateBenhNhan = async (req, res) => {
    const { HoTen, Email, SoDienThoai, DiaChi, GioiTinh, BenhAn, Tuoi, ChieuCao, CanNang } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('MaBenhNhan', sql.Int, req.params.id)
            .input('HoTen', sql.NVarChar, HoTen)
            .input('Email', sql.NVarChar, Email)
            .input('SoDienThoai', sql.NVarChar, SoDienThoai)
            .input('DiaChi', sql.NVarChar, DiaChi)
            .input('GioiTinh', sql.NVarChar, GioiTinh)
            .input('BenhAn', sql.NVarChar(sql.MAX), BenhAn)
            .input('Tuoi', sql.Int, Tuoi)
            .input('ChieuCao', sql.Decimal(5,2), ChieuCao)
            .input('CanNang', sql.Decimal(5,2), CanNang)
            .query(`
                UPDATE BenhNhan SET HoTen=@HoTen, Email=@Email, SoDienThoai=@SoDienThoai, DiaChi=@DiaChi, 
                GioiTinh=@GioiTinh, BenhAn=@BenhAn, Tuoi=@Tuoi, ChieuCao=@ChieuCao, CanNang=@CanNang
                WHERE MaBenhNhan=@MaBenhNhan
            `);
        res.json({ message: 'Cập nhật bệnh nhân thành công!' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteBenhNhan = async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('MaBenhNhan', sql.Int, req.params.id)
            .query('DELETE FROM BenhNhan WHERE MaBenhNhan=@MaBenhNhan');
        res.json({ message: 'Xóa bệnh nhân thành công!' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
