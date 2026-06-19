import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/balaji',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGINS: process.env.CORS_ORIGINS || 'http://localhost:5173',
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || '',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY:    process.env.CLOUDINARY_API_KEY    || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};

// Production safety guards
if (config.NODE_ENV === 'production') {
  if (config.JWT_SECRET === 'dev-secret-change-me' || config.JWT_SECRET.length < 32) {
    throw new Error('FATAL: JWT_SECRET must be a strong secret (>=32 chars) in production');
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('FATAL: MONGODB_URI must be set in production');
  }
  if (!process.env.CORS_ORIGINS) {
    throw new Error('FATAL: CORS_ORIGINS must be set in production');
  }
}
