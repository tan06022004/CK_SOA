const express = require('express');
const router = express.Router();
const { createRoomType, getAllRoomTypes } = require('../../controllers/roomTypeController');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('manager'), createRoomType)
  .get(getAllRoomTypes);

module.exports = router;