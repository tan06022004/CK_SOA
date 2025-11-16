const asyncHandler = require('express-async-handler');
const User = require('../models/userModel'); // Sửa đường dẫn
const jwt = require('jsonwebtoken');

// Hàm helper để tạo token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body; // Thêm role

    // 1. Kiểm tra xem email đã tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400); // Bad Request
        throw new Error('User already exists');
    }

    // 2. Tạo user mới
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'guest', // Nếu không cung cấp role, mặc định là customer
    });

    // 3. Trả về thông tin user và token
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Đăng nhập (xác thực) người dùng
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Tìm user bằng email
    const user = await User.findOne({ email });

    // 2. Kiểm tra user và mật khẩu
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401); // Unauthorized
        throw new Error('Invalid email or password');
    }
});

// @desc    Lấy thông tin profile của user đang đăng nhập
// @route   GET /api/auth/me
// @access  Private (Cần token)
const getMe = asyncHandler(async (req, res) => {
    // req.user được gán từ middleware 'protect'
    const user = req.user; 
    
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = { registerUser, loginUser, getMe };