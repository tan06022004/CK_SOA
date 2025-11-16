const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// 1. HÀM 'PROTECT' (Giữ nguyên - Vẫn hoàn hảo)
// Bảo vệ route, kiểm tra user đã đăng nhập chưa
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// 2. HÀM 'AUTHORIZE' (Nâng cấp)
// Thay thế cho 'admin' và 'staff'
// Nó nhận vào một danh sách các vai trò được phép
// Ví dụ: authorize('hotel manager', 'receptionist')
const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user được gán từ middleware 'protect'
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403); // 403 Forbidden
            throw new Error(`User role '${req.user.role}' is not authorized to access this resource`);
        }
        // Nếu role hợp lệ, cho đi tiếp
        next();
    };
};

// 3. EXPORT MỚI
module.exports = {
    protect,
    authorize, // <-- Chúng ta sẽ dùng hàm này thay vì 'admin' và 'staff'
};