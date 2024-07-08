import dotenv from 'dotenv';

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

app.listen(PORT, async () => {
  await db_connect();
  console.log(`server is running at http://localhost:${PORT}`);
});
