const express = require('express');
const guestController = require('../../controllers/guestController');
// THAY ĐỔI: Import middleware mới
const { protect, authorize } = require('../../middleware/authMiddleware');

const router = express.Router();

// THAY ĐỔI: Áp dụng bảo vệ cho tất cả routes bên dưới
// 1. Yêu cầu đăng nhập
router.use(protect);
// 2. Yêu cầu là Lễ tân hoặc Quản lý
router.use(authorize('receptionist', 'manager'));

router
  .route('/')
  .get(guestController.getAllGuests)
  .post(guestController.createGuest);

router
  .route('/:id')
  .get(guestController.getGuest)
  .patch(guestController.updateGuest);

module.exports = router;