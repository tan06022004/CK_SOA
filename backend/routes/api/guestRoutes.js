// routes/api/guestRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllGuests,
    getGuestById,
    createGuest,
    updateGuest
} = require('../../controllers/guestController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// Chỉ Lễ tân hoặc Quản lý
router.use(protect, authorize('receptionist', 'manager'));

router.route('/')
    .get(getAllGuests)
    .post(createGuest);

router.route('/:guestId') // Khớp với param 'guestId' trong Doc
    .get(getGuestById)
    .put(updateGuest); // Đổi sang PUT

module.exports = router;