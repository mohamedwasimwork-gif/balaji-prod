import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../models/User.js';

async function resetPasswords() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/balaji';
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  const updates = [
    { email: 'rahul@balaji-co.com', password: 'admin@123', label: 'Admin' },
    { email: 'employee@balaji-co.com', password: 'employee@123', label: 'Employee' },
  ];

  for (const { email, password, label } of updates) {
    const hash = await bcrypt.hash(password, 12);
    const result = await User.findOneAndUpdate(
      { email },
      { $set: { passwordHash: hash, isActive: true } },
      { new: true }
    );
    if (result) {
      console.log(`✅ ${label} (${email}) password updated`);
    } else {
      // User doesn't exist — create them
      await User.create({
        fullName: label === 'Admin' ? 'Rahul Admin' : 'Employee Demo',
        email,
        role: label === 'Admin' ? 'admin' : 'employee',
        isActive: true,
        passwordHash: hash,
      });
      console.log(`✅ ${label} (${email}) created with new password`);
    }
  }

  await mongoose.disconnect();
  console.log('\nDone. Credentials:');
  console.log('  Admin    → rahul@balaji-co.com  /  admin@123');
  console.log('  Employee → employee@balaji-co.com  /  employee@123');
}

resetPasswords().catch(console.error);
