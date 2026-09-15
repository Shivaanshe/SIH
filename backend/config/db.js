import mongoose from 'mongoose';

/**
 * Connect to MongoDB Database
 * Logs status and handles connection errors gracefully so server continues running even if DB is offline.
 */
export async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kaushalsetu';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000 // 4 second timeout before falling back
    });
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host} (${conn.connection.name})`);
    return true;
  } catch (error) {
    console.warn(`⚠️  [MongoDB Warning]: Could not connect to MongoDB at ${mongoUri}.`);
    console.warn(`    Reason: ${error.message}`);
    console.warn(`    The backend API will run in fallback mode until MongoDB is started.`);
    return false;
  }
}
