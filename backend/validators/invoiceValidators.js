const { body } = require('express-validator');

const createInvoiceRules = [
  body('totalAmount')
    .notEmpty().withMessage('Tổng tiền là bắt buộc')
    .isISO8601().withMessage('Tổng tiền không đúng format'),

  body('paymentStatus')
    .notEmpty().withMessage('Trạng thái thanh toán là bắt buộc')
    .isISO8601().withMessage('Trạng thái thanh toán không đúng format'),

  body('paymentMethod')
    .notEmpty().withMessage('Phương thức thanh toán là bắt buộc')
    .isISO8601().withMessage('Phương thức thanh toán không đúng format'),
];

module.exports = { createInvoiceRules };

