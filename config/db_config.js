import mongoose from 'mongoose';
const MONGODB_URL =
  process.env.MONGODB_URL || 'mongodb://localhost:27017/lms_backend';

mongoose.set('strictQuery', false);

const db_connect = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_URL);
    if (connection) {
      console.log(`Connected to db ${connection.host}`);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default db_connect;
