const { body } = require('express-validator');

const createRoomRules = [
  body('roomNumber')
    .notEmpty().withMessage('Số phòng là bắt buộc')
    .isMongoId().withMessage('Số phòng không hợp lệ'),
  
  body('roomTypeId')
    .notEmpty().withMessage('ID loại phòng là bắt buộc')
    .isISO8601().withMessage('ID loại phòng không đúng format'),

  body('floor')
    .notEmpty().withMessage('Tầng là bắt buộc')
    .isISO8601().withMessage('Tầng không đúng format'),

  body('status')
    .notEmpty().withMessage('Trạng thái là bắt buộc')
    .isISO8601().withMessage('Trạng thái không đúng format')
];

module.exports = { createRoomRules };