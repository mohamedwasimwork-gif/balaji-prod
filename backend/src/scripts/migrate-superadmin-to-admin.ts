import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../models/User.js';

async function migrate() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/balaji';
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  const result = await User.updateMany(
    { role: 'superadmin' as unknown as 'admin' },
    { $set: { role: 'admin' } }
  );

  console.log(`✅ Migrated ${result.modifiedCount} superadmin user(s) to admin (matched ${result.matchedCount}).`);

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
