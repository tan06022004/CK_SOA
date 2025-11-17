// routes/api/employeeRoutes.js
const express = require('express');
const router = express.Router();
const {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require('../../controllers/employeeController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// Chỉ Manager mới có quyền truy cập
router.use(protect, authorize('manager'));

router.route('/')
    .post(createEmployee)
    .get(getAllEmployees);

router.route('/:id')
    .get(getEmployeeById)
    .put(updateEmployee)
    .delete(deleteEmployee);

module.exports = router;