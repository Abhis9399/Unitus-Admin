// mongoose/mongodbUser.js

import mongoose from 'mongoose';

const MONGODB_URL_USER = process.env.MONGODB_URL_USER;

if (!MONGODB_URL_USER) {
  throw new Error('Please define the MONGODB_URL_USER environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL_USER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add any other necessary options here
    }).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
