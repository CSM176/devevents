/**
 * lib/mongodb.ts
 *
 * Mongoose connection helper for Next.js (TypeScript).
 * - Provides a typed `connectToDatabase` function that returns a
 *   `mongoose.Connection`.
 * - Caches the connection on the Node global to prevent multiple
 *   connections during development (hot reload / HMR).
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('The MONGODB_URI environment variable is not defined.');
}

declare global {
  // Extend NodeJS global to include a mongoose cache. This keeps
  // a single connection/promise across module reloads in development.
  namespace NodeJS {
    interface Global {
      mongooseCache?: {
        conn: mongoose.Connection | null;
        promise?: Promise<typeof mongoose> | null;
      };
    }
  }
}

// Initialize or reuse the cached object on the Node global.
const cached = (global as any).mongooseCache ?? ((global as any).mongooseCache = { conn: null, promise: undefined });

/**
 * Connect to MongoDB using Mongoose and return the active connection.
 * The connection is cached on the Node global so Next.js hot reloads
 * don't create additional connections.
 *
 * Returns: a Promise resolving to `mongoose.Connection`.
 */
export async function connectToDatabase(): Promise<mongoose.Connection> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is already being established, wait for it
  if (!cached.promise) {
    // Create and store the connecting promise so concurrent calls share it
    cached.promise = mongoose
      .connect(MONGODB_URI as string)
      .then((m) => m)
      .catch((err) => {
        // Clear promise on error so future attempts can retry
        cached.promise = undefined;
        throw err;
      });
  }

  const m = await cached.promise;
  cached.conn = m.connection;
  return cached.conn;
}

// Default export for convenient imports
export default connectToDatabase;
