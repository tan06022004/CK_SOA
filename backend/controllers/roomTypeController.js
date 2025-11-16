const asyncHandler = require('express-async-handler');
const RoomType = require('../models/roomTypeModel');

const createRoomType = asyncHandler(async (req, res) => {
  const type = await RoomType.create(req.body);
  res.status(201).json(type);
});

const getAllRoomTypes = asyncHandler(async (req, res) => {
  const types = await RoomType.find();
  res.json(types);
});

module.exports = { createRoomType, getAllRoomTypes };