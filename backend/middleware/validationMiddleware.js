const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({message: 'Du lieu ko hop le', errors: errors.array()})
    }

    next();
};

module.exports = { validate };