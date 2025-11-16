const Invoice = require('../models/invoiceModel');
const Booking = require('../models/bookingModel');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

// Thay thế catchAsync bằng try...catch nếu bạn chưa có
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Use Case: Generate Guest Invoice / Generate Financial Invoice
exports.createInvoiceFromBooking = catchAsync(async (req, res, next) => {
  const { bookingId } = req.body;
  
  if (!bookingId) {
    return res.status(400).json({ status: 'fail', message: 'Booking ID is required'});
  }

  const booking = await Booking.findById(bookingId).populate('room');
  if (!booking) {
    return res.status(404).json({ status: 'fail', message: 'No booking found'});
  }

  // SỬA: Tính toán tổng tiền thực tế từ booking
  // Giả sử room đã được populate và có roomType lồng nhau với basePrice
  // Bạn cần đảm bảo logic populate này
  // const room = await Room.findById(booking.room).populate('roomType'); (Nếu chưa populate)
  // const pricePerNight = booking.room.roomType.basePrice;
  // const nights = Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24));
  // const totalAmount = pricePerNight * nights;

  const totalAmount = booking.totalPrice; // Lấy từ bookingModel nếu bạn đã tính sẵn

  const newInvoice = await Invoice.create({
    booking: bookingId,
    totalAmount: totalAmount,
    // SỬA: Xóa trường 'guest' vì nó không có trong invoiceModel
  });

  res.status(201).json({
    status: 'success',
    data: {
      invoice: newInvoice,
    },
  });
});

// Use Case: Record Payment
exports.recordPayment = catchAsync(async (req, res, next) => {
  const { paymentMethod } = req.body; // Chỉ cần phương thức thanh toán

  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return res.status(404).json({ status: 'fail', message: 'No invoice found'});
  }
  
  // SỬA: Dùng 'paymentStatus' (từ model) thay vì 'status'
  invoice.paymentStatus = 'paid';
  invoice.paymentMethod = paymentMethod;

  // Lưu ý: 2 trường này không có trong model, Mongoose (strict) sẽ bỏ qua
  // Nếu muốn lưu, bạn phải thêm vào invoiceModel.js
  // invoice.paidAmount = invoice.totalAmount;
  // invoice.paymentDate = Date.now();
  
  await invoice.save();

  res.status(200).json({
    status: 'success',
    data: {
      invoice,
    },
  });
});

// Use Case: View Transaction History
exports.getTransactionHistory = catchAsync(async (req, res, next) => {
  const invoices = await Invoice.find()
    // SỬA: Dùng populate lồng nhau (nested populate)
    .populate({
      path: 'booking', // 1. Populate trường 'booking'
      populate: {
        path: 'guest', // 2. Populate trường 'guest' BÊN TRONG booking
        select: 'fullName email' // Chỉ lấy các trường cần thiết
      }
    })
  .sort('-createdAt');

 res.status(200).json({
  status: 'success',
  results: invoices.length,
  data: {
   invoices,
  },
 });
});

// Lấy 1 hóa đơn
exports.getInvoice = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id)
      // SỬA: Dùng populate lồng nhau (nested populate)
      .populate({
        path: 'booking',
        populate: [
          {
            path: 'guest', // Populate 'guest' bên trong 'booking'
            select: 'fullName email phoneNumber'
          },
          {
            path: 'room', // Populate 'room' bên trong 'booking'
            select: 'roomNumber'
          }
        ]
      });

  if (!invoice) {
    return res.status(404).json({ status: 'fail', message: 'No invoice found'});
  }

  res.status(200).json({
    status: 'success',
    data: {
      invoice,
    },
  });
});