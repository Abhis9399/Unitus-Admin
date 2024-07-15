import mongoose from 'mongoose';

const MONGODB_URL_USER = process.env.MONGODB_URL_USER;

if (!MONGODB_URL_USER) {
  throw new Error(
    'Please define the MONGODB_URL_USER environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using existing database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new database connection');
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URL_USER, opts).then((mongoose) => {
      console.log('Database connected successfully');
      return mongoose;
    }).catch(error => {
      console.error('Database connection error:', error);
      throw error;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
