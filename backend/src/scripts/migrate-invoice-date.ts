import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { Invoice } from '../models/Invoice.js';

async function migrate() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/balaji';
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  // Invoices created before invoiceDate existed fall back to their insert timestamp,
  // so date filtering and sorting keep working for historical records.
  const result = await Invoice.collection.updateMany(
    { invoiceDate: { $exists: false } },
    [{ $set: { invoiceDate: '$createdAt' } }]
  );

  console.log(`✅ Backfilled invoiceDate on ${result.modifiedCount} invoice(s) (matched ${result.matchedCount}).`);

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
