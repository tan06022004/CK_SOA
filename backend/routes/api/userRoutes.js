// routes/api/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../../controllers/userController');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.use(protect, authorize('manager'));
router.route('/').get(getAllUsers);
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;