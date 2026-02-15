import mongoose from 'mongoose';
import { ENV } from './env';

export async function connectDB() {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed');
    console.error(err);
    process.exit(1);
  }
}
