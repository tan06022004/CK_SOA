const Invoice = require('../models/invoiceModel');
const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');
// const catchAsync = require('../utils/catchAsync');

// Thay thế catchAsync bằng try...catch nếu bạn chưa có
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Use Case: Generate Revenue Report
exports.getRevenueReport = catchAsync(async (req, res, next) => {
  // Lấy doanh thu theo ngày
  const revenueStats = await Invoice.aggregate([
    {
      $match: { status: 'paid' } // Chỉ tính hóa đơn đã thanh toán
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } },
        totalRevenue: { $sum: "$totalAmount" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 } // Sắp xếp theo ngày
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      revenueStats,
    },
  });
});

// Use Case: View Room Occupancy Report / Monitor Real-time Room Status
exports.getRoomOccupancyReport = catchAsync(async (req, res, next) => {
  // Báo cáo tỷ lệ lấp đầy dựa trên trạng thái phòng
  const occupancyStats = await Room.aggregate([
    {
      $group: {
        _id: '$status', // Nhóm theo trạng thái (available, occupied, maintenance, cleaning)
        count: { $sum: 1 }
      }
    }
  ]);

  const totalRooms = await Room.countDocuments();
  
  res.status(200).json({
    status: 'success',
    data: {
      totalRooms,
      occupancyStats
    },
  });
});

// Use Case: View Revenue Dashboard (Tổng hợp)
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  // 1. Tổng doanh thu (từ hóa đơn đã thanh toán)
  const revenue = await Invoice.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
  ]);

  // 2. Tổng số booking (ví dụ: trong tháng này)
  const bookings = await Booking.countDocuments({
    // createdAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) }
  });

  // 3. Trạng thái phòng (lấy từ API ở trên)
  const roomStats = await Room.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalRevenue: revenue[0] ? revenue[0].totalRevenue : 0,
      totalBookings: bookings,
      roomStats: roomStats
    },
  });
});