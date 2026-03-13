const { body } = require('express-validator');

const createGuestRules = [
  body('fullName')
    .notEmpty().withMessage('Họ và tên là bắt buộc')
    .isMongoId().withMessage('Họ và tên không hợp lệ'),
  
  body('phoneNumber')
    .notEmpty().withMessage('Số điện thoại là bắt buộc')
    .isISO8601().withMessage('Số điện thoại không đúng format'),
  
  body('email')
    .notEmpty().withMessage('Email là bắt buộc')
    .isISO8601().withMessage('Email không đúng format'),

  body('address')
    .notEmpty().withMessage('Địa chỉ là bắt buộc')
    .isISO8601().withMessage('Địa chỉ không đúng format'),

  body('city')
    .notEmpty().withMessage('Thành phố là bắt buộc')
    .isISO8601().withMessage('Thành phố không đúng format'),

  body('country')
    .notEmpty().withMessage('Quốc gia là bắt buộc')
    .isISO8601().withMessage('Quốc gia không đúng format')
];

module.exports = { createGuestRules };