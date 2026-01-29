// controllers/khoaController.js
const { sql, poolPromise } = require("../config");

// Lấy danh sách khoa
const getAllKhoa = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT MaKhoa, Ten, MoTa, TrangThai
            FROM Khoa
        `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách khoa:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách khoa" });
    }
};

// Thêm mới khoa
const createKhoa = async (req, res) => {
    try {
        const { Ten, MoTa, TrangThai } = req.body;

        const pool = await poolPromise;
        await pool.request()
            .input('Ten', sql.NVarChar(100), Ten)
            .input('MoTa', sql.NVarChar(sql.MAX), MoTa)
            .input('TrangThai', sql.NVarChar(20), TrangThai)
            .query(`
                INSERT INTO Khoa (Ten, MoTa, TrangThai)
                VALUES (@Ten, @MoTa, @TrangThai)
            `);

        res.status(201).json({ message: "✅ Thêm khoa thành công!" });
    } catch (error) {
        console.error("❌ Lỗi khi thêm khoa:", error);
        res.status(500).json({ message: "Lỗi khi thêm khoa" });
    }
};

// Cập nhật khoa
const updateKhoa = async (req, res) => {
    try {
        const { id } = req.params;
        const { Ten, MoTa, TrangThai } = req.body;

        const pool = await poolPromise;
        await pool.request()
            .input('MaKhoa', sql.Int, id)
            .input('Ten', sql.NVarChar(100), Ten)
            .input('MoTa', sql.NVarChar(sql.MAX), MoTa)
            .input('TrangThai', sql.NVarChar(20), TrangThai)
            .query(`
                UPDATE Khoa
                SET Ten = @Ten,
                    MoTa = @MoTa,
                    TrangThai = @TrangThai
                WHERE MaKhoa = @MaKhoa
            `);

        res.status(200).json({ message: "✅ Cập nhật khoa thành công!" });
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật khoa:", error);
        res.status(500).json({ message: "Lỗi khi cập nhật khoa" });
    }
};

// Xoá khoa
const deleteKhoa = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;
        await pool.request()
            .input('MaKhoa', sql.Int, id)
            .query(`DELETE FROM Khoa WHERE MaKhoa = @MaKhoa`);

        res.status(200).json({ message: "✅ Xoá khoa thành công!" });
    } catch (error) {
        console.error("❌ Lỗi khi xoá khoa:", error);
        res.status(500).json({ message: "Lỗi khi xoá khoa" });
    }
};

module.exports = {
    getAllKhoa,
    createKhoa,
    updateKhoa,
    deleteKhoa
};
