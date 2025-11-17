const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require('../../controllers/employeeController');

const { protect, authorize } = require('../../middleware/authMiddleware');

router.use(protect, authorize('manager'));

router.route('/')
  .get(getAllEmployees);

router.route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
