// utils/db.js

import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URL_USER;
  if (!uri) {
    throw new Error('Please define the MONGODB_URL environment variable');
  }

  await mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
};
