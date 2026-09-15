import mongoose from 'mongoose';

/**
 * Sanitize and safely encode special characters in MongoDB URI credentials
 */
function sanitizeMongoUri(uri) {
  if (!uri) return 'mongodb://127.0.0.1:27017/kaushalsetu';
  try {
    const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@(.+)$/);
    if (match) {
      const [, prefix, user, rawPass, rest] = match;
      let safePass = rawPass;
      try {
        decodeURIComponent(rawPass);
      } catch {
        safePass = encodeURIComponent(rawPass);
      }
      return `${prefix}${encodeURIComponent(decodeURIComponent(user))}:${safePass}@${rest}`;
    }
  } catch {
    // Return original if parsing fails
  }
  return uri;
}

/**
 * Connect to MongoDB Database
 * 1. Attempts connection to configured MONGO_URI (Atlas).
 * 2. If Atlas fails (bad auth or network), automatically connects to local MongoDB (mongodb://127.0.0.1:27017/kaushalsetu).
 * 3. Never crashes the API server.
 */
export async function connectDB() {
  const primaryUri = sanitizeMongoUri(process.env.MONGO_URI);
  const fallbackUri = 'mongodb://127.0.0.1:27017/kaushalsetu';

  // Attempt 1: Configured URI (Atlas)
  if (primaryUri && !primaryUri.includes('127.0.0.1')) {
    try {
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 4000
      });
      console.log(`✅ [MongoDB Atlas Connected]: ${conn.connection.host} (${conn.connection.name})`);
      return true;
    } catch (error) {
      console.warn(`⚠️  [MongoDB Atlas]: Authentication failed or cluster unreachable (${error.message.slice(0, 60)}...).`);
      console.log(`🔄 [MongoDB Failover]: Connecting to active local MongoDB instance at ${fallbackUri}...`);
    }
  }

  // Attempt 2: Local MongoDB fallback
  try {
    const conn = await mongoose.connect(fallbackUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✅ [MongoDB Local Connected]: ${conn.connection.host} (${conn.connection.name})`);
    return true;
  } catch (error) {
    console.warn(`⚠️  [MongoDB Local Warning]: Could not connect to local MongoDB: ${error.message}`);
    return false;
  }
}
