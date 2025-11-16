const Guest = require('../models/guestModel');
// Giả sử bạn có 2 file utils này
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

// Thay thế catchAsync bằng try...catch nếu bạn chưa có
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Lấy tất cả khách hàng (để tìm kiếm)
exports.getAllGuests = catchAsync(async (req, res, next) => {
  // TODO: Thêm logic lọc (ví dụ: tìm theo SĐT, CMND)
  const guests = await Guest.find(req.query);

  res.status(200).json({
    status: 'success',
    results: guests.length,
    data: {
      guests,
    },
  });
});

// Lấy thông tin 1 khách hàng
exports.getGuest = catchAsync(async (req, res, next) => {
  const guest = await Guest.findById(req.params.id);

  if (!guest) {
    // return next(new AppError('No guest found with that ID', 404));
    return res.status(404).json({ status: 'fail', message: 'No guest found with that ID'});
  }

  res.status(200).json({
    status: 'success',
    data: {
      guest,
    },
  });
});

// Tạo khách hàng mới (khi check-in khách mới)
exports.createGuest = catchAsync(async (req, res, next) => {
  const newGuest = await Guest.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      guest: newGuest,
    },
  });
});

// Cập nhật thông tin khách
exports.updateGuest = catchAsync(async (req, res, next) => {
  const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!guest) {
    // return next(new AppError('No guest found with that ID', 404));
    return res.status(404).json({ status: 'fail', message: 'No guest found with that ID'});
  }

  res.status(200).json({
    status: 'success',
    data: {
      guest,
    },
  });
});