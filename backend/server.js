const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// ==================== USER SYSTEM APIs ====================

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // TODO: Validate credentials with database
  // Mock user data for demonstration
  const user = {
    id: 1,
    email: email,
    role: 'receptionist',
    name: 'John Doe'
  };
  
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({
    success: true,
    message: 'Login successful',
    token: token,
    user: user
  });
});

// Logout
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // TODO: Add token to blacklist in database
  res.json({ success: true, message: 'Logout successful' });
});

// Get Profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  // TODO: Fetch user profile from database
  res.json({
    success: true,
    user: req.user
  });
});

// ==================== RECEPTIONIST APIs ====================

// Get Available Rooms
app.get('/api/rooms/available', authenticateToken, authorizeRoles('receptionist', 'manager'), (req, res) => {
  const { checkinDate, checkoutDate, roomType } = req.query;
  
  // TODO: Query database for available rooms
  res.json({
    success: true,
    rooms: [
      { id: 1, roomNumber: '101', type: roomType || 'Standard', price: 100 },
      { id: 2, roomNumber: '102', type: roomType || 'Standard', price: 100 }
    ]
  });
});

// Create Booking
app.post('/api/bookings', authenticateToken, authorizeRoles('receptionist', 'manager'), (req, res) => {
  const { guestId, roomId, checkInDate, checkOutDate, numGuests } = req.body;
  
  // TODO: Create booking in database
  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    bookingId: 1
  });
});

// Update Booking
app.put('/api/bookings/:bookingId', authenticateToken, authorizeRoles('receptionist', 'manager'), (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  
  // TODO: Update booking in database
  res.json({
    success: true,
    message: 'Booking updated successfully'
  });
});

// Delete Booking
app.delete('/api/bookings/:bookingId', authenticateToken, authorizeRoles('receptionist', 'manager'), (req, res) => {
  const { bookingId } = req.params;
  
  // TODO: Delete booking from database
  res.json({
    success: true,
    message: 'Booking deleted successfully'
  });
});

// Update Guest Information
app.put('/api/guests/:guestId', authenticateToken, authorizeRoles('receptionist', 'manager'), (req, res) => {
  const { guestId } = req.params;
  const { name, phone, email, address, passport } = req.body;
  
  // TODO: Update guest information in database
  res.json({
    success: true,
    message: 'Guest information updated'
  });
});

// Check-in
app.post('/api/checkin', authenticateToken, authorizeRoles('receptionist', 'manager'), (req, res) => {
  const { bookingId, receptionistId } = req.body;
  
  // TODO: Process check-in in database
  res.json({
    success: true,
    message: 'Guest checked in successfully'
  });
});

// Check-out
app.post('/api/checkout', authenticateToken, authorizeRoles('receptionist', 'manager'), (req, res) => {
  const { bookingId, receptionistId } = req.body;
  
  // TODO: Process check-out in database
  res.json({
    success: true,
    message: 'Guest checked out successfully'
  });
});

// Get Guest Invoice
app.get('/api/invoices/guest/:bookingId', authenticateToken, authorizeRoles('receptionist', 'manager'), (req, res) => {
  const { bookingId } = req.params;
  
  // TODO: Fetch invoice from database
  res.json({
    success: true,
    invoice: {
      bookingId: bookingId,
      total: 500,
      items: []
    }
  });
});

// Update Room Status
app.put('/api/rooms/:roomId/status', authenticateToken, (req, res) => {
  const { roomId } = req.params;
  const { status } = req.body;
  
  // TODO: Update room status in database
  res.json({
    success: true,
    message: 'Room status updated'
  });
});

// ==================== HOUSEKEEPING APIs ====================

// Get Rooms Needing Cleaning
app.get('/api/rooms/cleaning', authenticateToken, authorizeRoles('housekeeping', 'manager'), (req, res) => {
  // TODO: Query database for rooms needing cleaning
  res.json({
    success: true,
    rooms: [
      { id: 1, roomNumber: '101', status: 'Needs Cleaning' },
      { id: 2, roomNumber: '205', status: 'Needs Cleaning' }
    ]
  });
});

// Report Maintenance Issue
app.post('/api/maintenance/issues', authenticateToken, authorizeRoles('housekeeping', 'manager'), (req, res) => {
  const { roomId, description, priority } = req.body;
  
  // TODO: Create maintenance issue in database
  res.status(201).json({
    success: true,
    message: 'Maintenance issue reported',
    issueId: 1
  });
});

// ==================== MAINTENANCE APIs ====================

// Get Maintenance Requests
app.get('/api/maintenance/requests', authenticateToken, authorizeRoles('maintenance', 'manager'), (req, res) => {
  // TODO: Query database for maintenance requests
  res.json({
    success: true,
    requests: [
      { id: 1, roomId: 101, description: 'AC not working', priority: 'High', status: 'Pending' }
    ]
  });
});

// Get Rooms Under Maintenance
app.get('/api/rooms/maintenance', authenticateToken, authorizeRoles('maintenance', 'manager'), (req, res) => {
  // TODO: Query database for rooms under maintenance
  res.json({
    success: true,
    rooms: [
      { id: 1, roomNumber: '103', issue: 'Plumbing' }
    ]
  });
});

// Update Maintenance Progress
app.put('/api/maintenance/:requestId', authenticateToken, authorizeRoles('maintenance', 'manager'), (req, res) => {
  const { requestId } = req.params;
  const { progress, status } = req.body;
  
  // TODO: Update maintenance progress in database
  res.json({
    success: true,
    message: 'Maintenance progress updated'
  });
});

// Complete Maintenance Task
app.put('/api/maintenance/:requestId/complete', authenticateToken, authorizeRoles('maintenance', 'manager'), (req, res) => {
  const { requestId } = req.params;
  const { completedBy } = req.body;
  
  // TODO: Mark maintenance as complete in database
  res.json({
    success: true,
    message: 'Maintenance task completed'
  });
});

// ==================== ACCOUNTANT APIs ====================

// Record Payment
app.post('/api/payments', authenticateToken, authorizeRoles('accountant', 'manager'), (req, res) => {
  const { bookingId, amount, method, date } = req.body;
  
  // TODO: Record payment in database
  res.status(201).json({
    success: true,
    message: 'Payment recorded successfully',
    paymentId: 1
  });
});

// Get Financial Invoice
app.get('/api/invoices/financial/:bookingId', authenticateToken, authorizeRoles('accountant', 'manager'), (req, res) => {
  const { bookingId } = req.params;
  
  // TODO: Fetch financial invoice from database
  res.json({
    success: true,
    invoice: {
      bookingId: bookingId,
      subtotal: 450,
      tax: 50,
      total: 500
    }
  });
});

// Get Revenue Report
app.get('/api/reports/revenue', authenticateToken, authorizeRoles('accountant', 'manager'), (req, res) => {
  const { from, to } = req.query;
  
  // TODO: Generate revenue report from database
  res.json({
    success: true,
    report: {
      from: from,
      to: to,
      totalRevenue: 10000,
      bookings: 50
    }
  });
});

// Get Transactions
app.get('/api/transactions', authenticateToken, authorizeRoles('accountant', 'manager'), (req, res) => {
  const { from, to } = req.query;
  
  // TODO: Fetch transactions from database
  res.json({
    success: true,
    transactions: [
      { id: 1, bookingId: 1, amount: 500, method: 'Credit Card', date: '2024-01-15' }
    ]
  });
});

// ==================== HOTEL MANAGER APIs ====================

// Create Employee
app.post('/api/employees', authenticateToken, authorizeRoles('manager'), (req, res) => {
  const { name, role, email, password } = req.body;
  
  // TODO: Create employee in database
  res.status(201).json({
    success: true,
    message: 'Employee account created',
    employeeId: 1
  });
});

// Update Employee
app.put('/api/employees/:id', authenticateToken, authorizeRoles('manager'), (req, res) => {
  const { id } = req.params;
  const { name, role, status } = req.body;
  
  // TODO: Update employee in database
  res.json({
    success: true,
    message: 'Employee information updated'
  });
});

// Delete Employee
app.delete('/api/employees/:id', authenticateToken, authorizeRoles('manager'), (req, res) => {
  const { id } = req.params;
  
  // TODO: Delete employee from database
  res.json({
    success: true,
    message: 'Employee deleted successfully'
  });
});

// Export Comprehensive Report
app.get('/api/reports/comprehensive/export', authenticateToken, authorizeRoles('manager'), (req, res) => {
  const { from, to } = req.query;
  
  // TODO: Generate comprehensive report
  res.json({
    success: true,
    message: 'Comprehensive report exported',
    downloadUrl: '/downloads/report.pdf'
  });
});

// Get Occupancy Report
app.get('/api/reports/occupancy', authenticateToken, authorizeRoles('manager'), (req, res) => {
  const { from, to } = req.query;
  
  // TODO: Generate occupancy report from database
  res.json({
    success: true,
    report: {
      from: from,
      to: to,
      occupancyRate: 85,
      totalRooms: 100,
      occupiedRooms: 85
    }
  });
});

// Get Revenue Dashboard
app.get('/api/dashboard/revenue', authenticateToken, authorizeRoles('manager'), (req, res) => {
  // TODO: Fetch revenue dashboard data from database
  res.json({
    success: true,
    dashboard: {
      todayRevenue: 5000,
      monthRevenue: 150000,
      yearRevenue: 1800000
    }
  });
});

// Get Real-time Room Status
app.get('/api/rooms/status/realtime', authenticateToken, authorizeRoles('manager'), (req, res) => {
  // TODO: Fetch real-time room status from database
  res.json({
    success: true,
    rooms: [
      { roomNumber: '101', status: 'Occupied' },
      { roomNumber: '102', status: 'Available' },
      { roomNumber: '103', status: 'Maintenance' }
    ]
  });
});

// ==================== ERROR HANDLING ====================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 HotelMaster API Server running on port ${PORT}`);
  console.log(`📍 Base URL: http://localhost:${PORT}`);
});

module.exports = app;