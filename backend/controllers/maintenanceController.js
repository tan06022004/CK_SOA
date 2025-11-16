const Maintenance = require('../models/maintenanceModel');
const Room = require('../models/roomModel');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

// Thay thế catchAsync bằng try...catch nếu bạn chưa có
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Use Case: Report Maintenance Issue
exports.createMaintenanceRequest = catchAsync(async (req, res, next) => {
  const { room, issueDescription, priority } = req.body;

  const newRequest = await Maintenance.create({
    room,
    issueDescription,
    priority,
    reportedBy: req.user.id, // Giả sử đã có middleware bảo vệ gán req.user
  });
  
  // Logic cập nhật trạng thái phòng đã nằm trong Model
  res.status(201).json({
    status: 'success',
    data: {
      request: newRequest,
    },
  });
});

// Lấy tất cả yêu cầu bảo trì (cho Maintenance Staff, Manager)
exports.getAllMaintenanceRequests = catchAsync(async (req, res, next) => {
  // Lọc theo trạng thái (vd: chỉ lấy 'reported', 'in_progress')
  const filter = req.query.status ? { status: req.query.status } : {};

  const requests = await Maintenance.find(filter).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: requests.length,
    data: {
      requests,
    },
  });
});

// Use Case: Handle Maintenance Request / Update Maintenance Progress
exports.updateMaintenanceRequest = catchAsync(async (req, res, next) => {
  // Chỉ cho phép cập nhật status hoặc assignedTo
  const { status, assignedTo } = req.body;

  const request = await Maintenance.findByIdAndUpdate(
    req.params.id,
    { status, assignedTo },
    { new: true, runValidators: true }
  );

  if (!request) {
    // return next(new AppError('No maintenance request found with that ID', 404));
    return res.status(404).json({ status: 'fail', message: 'No maintenance request found'});
  }

  res.status(200).json({
    status: 'success',
    data: {
      request,
    },
  });
});

// Use Case: Complete Maintenance Task
exports.completeMaintenanceTask = catchAsync(async (req, res, next) => {
  const request = await Maintenance.findById(req.params.id);

  if (!request) {
    // return next(new AppError('No maintenance request found with that ID', 404));
    return res.status(404).json({ status: 'fail', message: 'No maintenance request found'});
  }

  request.status = 'completed';
  request.completedAt = Date.now();
  await request.save();

  // CẬP NHẬT TRẠNG THÁI PHÒNG:
  // Giả sử sau khi bảo trì xong, phòng cần được dọn dẹp
  // Nếu quy trình là: Sửa xong -> Dọn dẹp -> Sẵn sàng
  // thì nên set status là 'cleaning'
  // Nếu sửa xong là sẵn sàng luôn, thì set 'available'
  
  // TODO: Cân nhắc trạng thái phòng chính xác (available hoặc cleaning)
  await Room.findByIdAndUpdate(request.room, { status: 'available' });

  res.status(200).json({
    status: 'success',
    data: {
      request,
    },
  });
});