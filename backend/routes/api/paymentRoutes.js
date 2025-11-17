// routes/api/paymentRoutes.js
const express = require('express');
const router = express.Router();
const {
    recordPayment,
    getTransactionHistory
} = require('../../controllers/paymentController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// Ghi nhận thanh toán (Lễ tân, Kế toán)
router.post('/payments',
    protect,
    authorize('receptionist', 'accountant'),
    recordPayment
);

// Xem giao dịch (Kế toán, Quản lý)
router.get('/transactions',
    protect,
    authorize('accountant', 'manager'),
    getTransactionHistory
);

module.exports = router;