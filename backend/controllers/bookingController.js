const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');
const Guest = require('../models/guestModel');
const RoomType = require('../models/roomTypeModel');

/**
 * @desc    Tạo booking mới
 * @route   POST /api/bookings
 * @access  Private (Receptionist, Manager)
 */
const createBooking = asyncHandler(async (req, res) => {
  const { 
    customerId, // ID của Guest nếu đã tồn tại
    guestInfo,  // Thông tin guest mới { fullName, phoneNumber, email }
    roomId, 
    checkInDate, 
    checkOutDate, 
    numberOfGuests
    // 'specialRequest' không có trong bookingModel
  } = req.body;

  let guest;
  // 1. Tìm hoặc tạo Guest
  if (customerId) {
    guest = await Guest.findById(customerId);
    if (!guest) {
      res.status(404); throw new Error('Không tìm thấy Guest ID');
    }
  } else if (guestInfo && guestInfo.fullName && guestInfo.phoneNumber) {
    guest = await Guest.findOneAndUpdate(
      { phoneNumber: guestInfo.phoneNumber }, // Dùng SĐT làm key
      { $setOnInsert: guestInfo },
      { upsert: true, new: true, runValidators: true }
    );
  } else {
    res.status(400);
    throw new Error('Cần thông tin customerId hoặc guestInfo');
  }

  // 2. Kiểm tra phòng và lấy giá
  const room = await Room.findById(roomId);
  if (!room) {
    res.status(404); throw new Error('Không tìm thấy phòng');
  }
  const roomType = await RoomType.findById(room.roomType);
  if (!roomType) {
    res.status(404); throw new Error('Không tìm thấy loại phòng liên kết');
  }

  // 3. Kiểm tra xung đột lịch
  const conflict = await Booking.findOne({
    room: roomId,
    status: { $in: ['confirmed', 'checked_in'] },
    $or: [
      { checkInDate: { $lt: new Date(checkOutDate) }, checkOutDate: { $gt: new Date(checkInDate) } }
    ]
  });
  if (conflict) {
    res.status(400);
    throw new Error('Phòng đã được đặt trong khoảng ngày này');
  }

  // 4. Tính tiền (ưu tiên basePrice từ roomTypeModel)
  const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
  if (nights <= 0) {
    res.status(400);
    throw new Error('Ngày check-out phải sau ngày check-in');
  }
  const totalPrice = roomType.basePrice * nights;

  // 5. Tạo booking
  const booking = await Booking.create({
    guest: guest._id,
    room: roomId,
    createdBy: req.user._id,
    checkInDate,
    checkOutDate,
    numberOfGuests: numberOfGuests || 1,
    totalPrice, // Tính toán từ logic
    status: 'confirmed' // Doc yêu cầu tạo là 'confirmed'
  });
  
  // (Không cần cập nhật trạng thái phòng ngay, vì phòng vẫn 'available' cho đến khi check-in)

  const populatedBooking = await booking.populate([
      { path: 'guest' },
      { path: 'room', populate: { path: 'roomType' } },
      { path: 'createdBy', select: 'name role' }
  ]);
  res.status(201).json(populatedBooking);
});

/**
 * @desc    Lấy tất cả booking (kèm filter)
 * @route   GET /api/bookings
 * @access  Private (Receptionist, Manager, Accountant)
 */
const getAllBookings = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.customerId) filter.guest = req.query.customerId;
  if (req.query.roomId) filter.room = req.query.roomId;
  if (req.query.fromDate) filter.checkInDate = { ...filter.checkInDate, $gte: new Date(req.query.fromDate) };
  if (req.query.toDate) filter.checkOutDate = { ...filter.checkOutDate, $lte: new Date(req.query.toDate) };

  const bookings = await Booking.find(filter)
    .populate('guest', 'fullName phoneNumber')
    .populate('room', 'roomNumber')
    .populate('createdBy', 'name')
    .sort('-checkInDate');
  res.json(bookings);
});

/**
 * @desc    Lấy booking theo ID
 * @route   GET /api/bookings/:bookingId
 * @access  Private
 */
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId)
    .populate('guest')
    .populate({ path: 'room', populate: { path: 'roomType' } })
    .populate('createdBy', 'name role');
  if (!booking) {
    res.status(404);
    throw new Error('Không tìm thấy booking');
  }
  res.json(booking);
});

/**
 * @desc    Cập nhật chi tiết booking
 * @route   PUT /api/bookings/:bookingId
 * @access  Private (Receptionist)
 */
const updateBooking = asyncHandler(async (req, res) => {
  const { roomId, checkInDate, checkOutDate, numberOfGuests, status } = req.body;
  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Không tìm thấy booking');
  }
  
  // Cảnh báo: Logic này rất phức tạp
  // Nếu đổi ngày hoặc phòng, cần kiểm tra xung đột và tính lại tiền
  // Tạm thời chỉ cập nhật các trường đơn giản:
  booking.numberOfGuests = numberOfGuests || booking.numberOfGuests;
  booking.status = status || booking.status; // Cẩn thận khi đổi status ở đây
  // TODO: Thêm logic kiểm tra xung đột nếu checkInDate, checkOutDate, roomId thay đổi
  
  const updated = await booking.save();
  res.json(updated);
});

/**
 * @desc    Hủy booking
 * @route   POST /api/bookings/:bookingId/cancel
 * @access  Private (Receptionist)
 */
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Không tìm thấy booking');
  }
  if (booking.status === 'checked_in' || booking.status === 'checked_out') {
    res.status(400);
    throw new Error('Không thể hủy booking đã check-in hoặc check-out');
  }

  booking.status = 'cancelled';
  // (Không cần cập nhật trạng thái phòng, vì nó chưa bao giờ bị set 'occupied')
  
  const updated = await booking.save();
  res.json(updated);
});

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
};