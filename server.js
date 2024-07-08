import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 5000;

import app from './app.js';
import db_connect from './config/db_config.js';

app.listen(PORT, async () => {
  await db_connect();
  console.log(`server is running at http://localhost:${PORT}`);
});
