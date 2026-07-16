import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { Expense } from '../models/Expense.js';

async function migrate() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/balaji';
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  // Expenses created before expenseDate existed fall back to their insert timestamp,
  // so date filtering and sorting keep working for historical records.
  const result = await Expense.collection.updateMany(
    { expenseDate: { $exists: false } },
    [{ $set: { expenseDate: '$createdAt' } }]
  );

  console.log(`✅ Backfilled expenseDate on ${result.modifiedCount} expense(s) (matched ${result.matchedCount}).`);

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
