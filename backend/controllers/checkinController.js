const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');
const Invoice = require('../models/invoiceModel');

/**
 * @desc    Check-in
 * @route   POST /api/checkin
 * @access  Private (Receptionist)
 */
const checkIn = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Không tìm thấy booking');
  }
  if (booking.status !== 'confirmed') {
    res.status(400);
    throw new Error(`Booking đang ở trạng thái '${booking.status}', không thể check-in`);
  }
  
  // 1. Cập nhật trạng thái phòng
  await Room.findByIdAndUpdate(booking.room, { status: 'occupied' });
  
  // 2. Cập nhật trạng thái booking
  booking.status = 'checked_in';
  // booking.actualCheckIn = Date.now(); // (Nếu model có trường này)
  
  const updatedBooking = await booking.save();
  res.json(updatedBooking);
});

/**
 * @desc    Check-out
 * @route   POST /api/checkout
 * @access  Private (Receptionist)
 */
const checkOut = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Không tìm thấy booking');
  }
  if (booking.status !== 'checked_in') {
    res.status(400);
    throw new Error(`Booking đang ở trạng thái '${booking.status}', không thể check-out`);
  }
  
  // 1. Cập nhật trạng thái phòng thành 'dirty' (cần dọn)
  await Room.findByIdAndUpdate(booking.room, { status: 'dirty' });
  
  // 2. Cập nhật trạng thái booking
  booking.status = 'checked_out';
  // booking.actualCheckOut = Date.now(); // (Nếu model có trường này)
  
  // 3. Tự động tạo hóa đơn (Theo logic file Doc)
  let invoice = await Invoice.findOne({ booking: booking._id });
  if (!invoice) {
      invoice = await Invoice.create({
          booking: booking._id,
          totalAmount: booking.totalPrice,
          issueDate: Date.now(),
          paymentStatus: 'pending' // Khớp với invoiceModel
      });
  }
  
  await booking.save();
  
  res.json({
      message: 'Check-out thành công, đã tạo hóa đơn.',
      booking,
      invoice
  });
});

module.exports = {
  checkIn,
  checkOut,
};