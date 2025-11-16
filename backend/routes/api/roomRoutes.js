// routes/api/roomRoutes.js
const express = require('express');
const router = express.Router();
const {
  createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom
} = require('../../controllers/roomController');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('manager'), createRoom)
  .get(getAllRooms);

router.route('/:id')
  .get(getRoomById)
  .put(protect, authorize('manager', 'receptionist'), updateRoom)
  .delete(protect, authorize('manager'), deleteRoom);

module.exports = router;