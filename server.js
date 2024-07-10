import dotenv from 'dotenv';
import Razorpay from 'razorpay'

dotenv.config();
const PORT = process.env.PORT || 5000;

import app from './app.js';
import db_connect from './config/db_config.js';
import { v2 } from 'cloudinary';

// cloudinary Configurations
v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECTRET,
});

app.listen(PORT, async () => {
  await db_connect();
  console.log(`server is running at http://localhost:${PORT}`);
});
