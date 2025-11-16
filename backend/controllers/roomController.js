// controllers/roomController.js
const asyncHandler = require('express-async-handler');
const Room = require('../models/roomModel');
const RoomType = require('../models/roomTypeModel');

// @desc    Tạo phòng mới
// @route   POST /api/rooms
// @access  Private/manager
const createRoom = asyncHandler(async (req, res) => {
  const { roomNumber, roomTypeId, floor } = req.body;

  // 1. Kiểm tra roomNumber trùng
  if (await Room.findOne({ roomNumber })) {
    res.status(400);
    throw new Error('Room number already exists');
  }

  // 2. Kiểm tra roomTypeId tồn tại
  const roomType = await RoomType.findById(roomTypeId);
  if (!roomType) {
    res.status(400);
    throw new Error('Invalid room type ID');
  }

  // 3. Tạo phòng
  const room = await Room.create({
    roomNumber,
    roomType: roomTypeId,
    floor,
  });

  // 4. Populate và trả về
  const populated = await room.populate('roomType', 'typeName basePrice capacity amenities');
  res.status(201).json(populated);
});

// @desc    Lấy tất cả phòng
// @route   GET /api/rooms
// @access  Public
const getAllRooms = asyncHandler(async (req, res) => {
  const { status, roomType } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (roomType) filter.roomType = roomType;

  const rooms = await Room.find(filter)
    .populate('roomType', 'typeName basePrice capacity amenities')
    .lean(); // optional – faster response

  res.json(rooms);
});

// @desc    Lấy phòng theo ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id)
    .populate('roomType', 'typeName basePrice capacity amenities');

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  res.json(room);
});

// @desc    Cập nhật phòng
// @route   PUT /api/rooms/:id
// @access  Private/manager,receptionist
const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  const { roomNumber, roomTypeId, floor, status, description } = req.body;

  // Kiểm tra roomNumber trùng (trừ chính nó)
  if (roomNumber && roomNumber !== room.roomNumber) {
    const exists = await Room.findOne({ roomNumber });
    if (exists) {
      res.status(400);
      throw new Error('Room number already exists');
    }
  }

  // Kiểm tra roomTypeId hợp lệ nếu được gửi
  if (roomTypeId) {
    const rt = await RoomType.findById(roomTypeId);
    if (!rt) {
      res.status(400);
      throw new Error('Invalid room type ID');
    }
    room.roomType = roomTypeId;
  }

  // Cập nhật các field khác
  if (roomNumber) room.roomNumber = roomNumber;
  if (floor !== undefined) room.floor = floor;
  if (status) room.status = status;
  if (description !== undefined) room.description = description;

  const updated = await room.save(); // <-- await đúng
  const populated = await updated.populate(
    'roomType',
    'typeName basePrice capacity amenities'
  );

  res.json(populated);
});

// @desc    Xóa phòng
// @route   DELETE /api/rooms/:id
// @access  Private/manager
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  // Kiểm tra có booking đang active không (tùy chọn)
  const activeBooking = await require('../models/bookingModel').findOne({
    room: room._id,
    status: { $in: ['confirmed', 'checked_in'] },
  });
  if (activeBooking) {
    res.status(400);
    throw new Error('Cannot delete room with active bookings');
  }

  await Room.deleteOne({ _id: room._id });
  res.json({ message: 'Room removed' });
});

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};