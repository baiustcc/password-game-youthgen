import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    let mongoUrl: string;

    if (process.env.NODE_ENV === "development") {
      // Use memory server for development
      if (!(global as any).mongoServer) {
        (global as any).mongoServer = await MongoMemoryServer.create();
      }
      mongoUrl = (global as any).mongoServer.getUri();
    } else {
      // Use MongoDB Atlas or your production DB URL
      mongoUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/password-game";
    }

    cached.promise = mongoose.connect(mongoUrl, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
