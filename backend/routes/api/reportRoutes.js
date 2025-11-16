const express = require('express');
const reportController = require('../../controllers/reportController');
// THAY ĐỔI: Import middleware mới
const { protect, authorize } = require('../../middleware/authMiddleware');

const router = express.Router();

// THAY ĐỔI: Áp dụng bảo vệ cho tất cả routes bên dưới
// 1. Yêu cầu đăng nhập
router.use(protect);
// 2. Yêu cầu là Quản lý hoặc Kế toán
router.use(authorize('manager', 'accountant'));

// Use Case: Generate Revenue Report
router.get('/revenue', reportController.getRevenueReport);

// Use Case: View Room Occupancy Report
router.get('/occupancy', reportController.getRoomOccupancyReport);

// Use Case: View Revenue Dashboard
router.get('/dashboard', reportController.getDashboardStats);

module.exports = router;