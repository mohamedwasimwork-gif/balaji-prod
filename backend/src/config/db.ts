import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDB(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(config.MONGODB_URI);
      console.log('MongoDB connected:', config.MONGODB_URI);

      mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));
      mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1}/${retries} failed:`, err);
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw new Error(`Failed to connect to MongoDB after ${retries} attempts`);
}
