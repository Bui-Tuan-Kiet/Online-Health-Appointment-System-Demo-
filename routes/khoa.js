// routes/khoa.js
const express = require("express");
const router = express.Router();
const khoaController = require("../controllers/khoaController");

// Các API về Khoa
router.get("/", khoaController.getAllKhoa);          // Lấy danh sách khoa
router.post("/", khoaController.createKhoa);         // Thêm mới khoa
router.put("/:id", khoaController.updateKhoa);       // Cập nhật khoa theo ID
router.delete("/:id", khoaController.deleteKhoa);    // Xoá khoa theo ID

module.exports = router;
