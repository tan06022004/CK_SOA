// controllers/bookingController.js
const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');
const Guest = require('../models/guestModel');

// @desc    Tạo booking mới (chỉ receptionist/manager)
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { room: roomId, checkInDate, checkOutDate, guestInfo, numberOfGuests = 1 } = req.body;

  if (!['receptionist', 'manager'].includes(req.user.role)) {
    res.status(403);
    throw new Error('Only receptionist or manager can create bookings');
  }

  // Tìm hoặc tạo Guest
  let guest = await Guest.findOne({ email: guestInfo.email });
  if (!guest) {
    guest = await Guest.create(guestInfo);
  }

  // Kiểm tra phòng tồn tại và trống
  const room = await Room.findById(roomId).populate('roomType');
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }
  if (room.status !== 'available') {
    res.status(400);
    throw new Error('Room is not available');
  }

  // Kiểm tra xung đột lịch
  const conflict = await Booking.findOne({
    room: roomId,
    status: { $in: ['confirmed', 'checked_in'] },
    $or: [
      { checkInDate: { $lt: new Date(checkOutDate) }, checkOutDate: { $gt: new Date(checkInDate) } }
    ]
  });
  if (conflict) {
    res.status(400);
    throw new Error('Room already booked for selected dates');
  }

  // Tính tiền
  const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
  if (nights <= 0) {
    res.status(400);
    throw new Error('Invalid date range');
  }
  const totalPrice = room.roomType.basePrice * nights;

  // Tạo booking
  const booking = await Booking.create({
    guest: guest._id,
    room: roomId,
    createdBy: req.user._id,
    checkInDate,
    checkOutDate,
    numberOfGuests,
    totalPrice,
    status: 'confirmed'
  });

  await booking.populate([
      { path: 'guest', select: 'fullName email phone' },
      {
          path: 'room',
          select: 'roomNumber', // Lấy trường roomNumber của 'room'
          populate: { // Populate lồng nhau
              path: 'roomType', // Populate trường 'roomType' BÊN TRONG 'room'
              select: 'typeName basePrice' // Lấy các trường của 'roomType'
          }
      },
      { path: 'createdBy', select: 'fullName role' }
  ]);

  res.status(201).json(booking); // Trả về booking đã được populate
});

// @desc    Lấy tất cả booking
// @route   GET /api/bookings
// @access  Private (receptionist, manager, accountant)
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('guest', 'fullName email')
    .populate('room', 'roomNumber')
    .populate('room.roomType', 'typeName')
    .populate('createdBy', 'fullName role');
  res.json(bookings);
});

// @desc    Lấy booking theo ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('guest', 'fullName email phone')
    .populate('room', 'roomNumber')
    .populate('room.roomType', 'typeName basePrice')
    .populate('createdBy', 'fullName role');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  res.json(booking);
});

// @desc    Cập nhật trạng thái booking
// @route   PUT /api/bookings/:id/status
// @access  Private (receptionist, manager)
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['checked_in', 'checked_out', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Cập nhật trạng thái phòng
  const roomUpdates = {
    checked_in: 'occupied',
    checked_out: 'dirty',
    cancelled: 'available'
  };
  await Room.findByIdAndUpdate(booking.room, { status: roomUpdates[status] });

  booking.status = status === 'checked_in' ? 'checked_in' :
                   status === 'checked_out' ? 'checked_out' : 'cancelled';

  const updated = await booking.save();
  await updated.populate([
      { path: 'guest', select: 'fullName' },
      {
          path: 'room',
          select: 'roomNumber',
          populate: { // Populate lồng nhau
              path: 'roomType', // Populate trường 'roomType' BÊN TRONG 'room'
              select: 'typeName' // Lấy trường 'typeName' của 'roomType'
          }
      }
  ]);

  res.json(updated);
});

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus
};