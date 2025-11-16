// routes/api/bookingRoutes.js
const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus
} = require('../../controllers/bookingController');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('receptionist', 'manager'), createBooking)
  .get(protect, authorize('receptionist', 'manager', 'accountant'), getAllBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.put('/:id/status', protect, authorize('receptionist', 'manager'), updateBookingStatus);

module.exports = router;