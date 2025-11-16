const express = require('express');
const maintenanceController = require('../../controllers/maintenanceController');
// THAY ĐỔI: Import middleware mới
const { protect, authorize } = require('../../middleware/authMiddleware');

const router = express.Router();

// THAY ĐỔI: Yêu cầu đăng nhập cho TẤT CẢ routes bảo trì
router.use(protect);

// Use Case: Report Maintenance Issue
// THAY ĐỔI: Bảo vệ route (Ai cũng có thể báo cáo: Buồng phòng, Lễ tân, Quản lý)
router.post('/',
  authorize('housekeeper', 'receptionist', 'manager'),
  maintenanceController.createMaintenanceRequest
);

// Use Case: Xem, Xử lý, Cập nhật
// THAY ĐỔI: Bảo vệ route (Chỉ Nhân viên bảo trì, Quản lý)
router.route('/').get(
  authorize('maintenance', 'manager'),
  maintenanceController.getAllMaintenanceRequests
);

// THAY ĐỔI: Bảo vệ route (Chỉ Nhân viên bảo trì, Quản lý)
router
  .route('/:id')
  .patch(
    authorize('maintenance', 'manager'),
    maintenanceController.updateMaintenanceRequest
  );

// Use Case: Complete Maintenance Task
// THAY ĐỔI: Bảo vệ route (Chỉ Nhân viên bảo trì, Quản lý)
router
  .route('/:id/complete')
  .post(
    authorize('maintenance', 'manager'),
    maintenanceController.completeMaintenanceTask
  );

module.exports = router;