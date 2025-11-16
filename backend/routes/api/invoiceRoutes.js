const express = require('express');
const invoiceController = require('../../controllers/invoiceController');
// THAY ĐỔI: Import middleware mới
const { protect, authorize } = require('../../middleware/authMiddleware');

const router = express.Router();

// THAY ĐỔI: Yêu cầu đăng nhập cho TẤT CẢ routes hóa đơn
router.use(protect);

// Use Case: View Transaction History & Generate Invoice
router.route('/')
  // THAY ĐỔI: Bảo vệ route
  .get(
    authorize('accountant', 'receptionist', 'manager'),
    invoiceController.getTransactionHistory
  )
  // THAY ĐỔI: Bảo vệ route
  .post(
    authorize('receptionist', 'manager'),
    invoiceController.createInvoiceFromBooking
  );

// THAY ĐỔI: Bảo vệ route
router.route('/:id').get(
  authorize('accountant', 'receptionist', 'manager'),
  invoiceController.getInvoice
);

// Use Case: Record Payment
router
  .route('/:id/payment')
  // THAY ĐỔI: Bảo vệ route (CHỈ KẾ TOÁN)
  .post(
    authorize('accountant'),
    invoiceController.recordPayment
  );

module.exports = router;