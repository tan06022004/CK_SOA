const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/userModel');

const seedUsers = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      console.error('❌ Error: MONGODB_URL not found in .env file');
      console.log('\n📝 Please create a .env file in the backend folder with:');
      console.log('   MONGODB_URL=mongodb://localhost:27017/hotel_management');
      console.log('   OR for MongoDB Atlas:');
      console.log('   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/hotel_management\n');
      process.exit(1);
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    const users = [
      {
        name: 'Manager',
        email: 'manager@hotel.com',
        password: await bcrypt.hash('123456', 10),
        role: 'manager'
      },
      {
        name: 'Receptionist',
        email: 'receptionist@hotel.com',
        password: await bcrypt.hash('123456', 10),
        role: 'receptionist'
      },
      {
        name: 'Accountant',
        email: 'accountant@hotel.com',
        password: await bcrypt.hash('123456', 10),
        role: 'accountant'
      },
      {
        name: 'Housekeeper',
        email: 'housekeeper@hotel.com',
        password: await bcrypt.hash('123456', 10),
        role: 'housekeeper'
      },
      {
        name: 'Maintenance',
        email: 'maintenance@hotel.com',
        password: await bcrypt.hash('123456', 10),
        role: 'maintenance'
      }
    ];

    // Clear existing users (optional - comment out if you want to keep existing users)
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Insert new users
    await User.insertMany(users);
    console.log('✅ Users seeded successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    users.forEach(user => {
      console.log(`Email: ${user.email} | Password: 123456 | Role: ${user.role}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding users:', error.message);
    
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.log('\n💡 This looks like a MongoDB Atlas IP whitelist issue.');
      console.log('   Solutions:');
      console.log('   1. Go to MongoDB Atlas → Network Access → Add your IP');
      console.log('   2. OR use local MongoDB: MONGODB_URL=mongodb://localhost:27017/hotel_management');
      console.log('   See MONGODB_SETUP.md for detailed instructions.\n');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Authentication failed. Check your username/password in MONGODB_URL');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('connection')) {
      console.log('\n💡 Cannot connect to MongoDB. Make sure:');
      console.log('   1. MongoDB is running (for local)');
      console.log('   2. MONGODB_URL is correct in .env file');
      console.log('   3. Network/firewall allows connection\n');
    }
    
    process.exit(1);
  }
};

seedUsers();

