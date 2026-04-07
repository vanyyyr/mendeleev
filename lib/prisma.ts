import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient | null {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn('DATABASE_URL not set — running in offline mode');
      return null;
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    return null;
  }
}

const _prisma = globalForPrisma.prisma ?? createPrismaClient() ?? null;

if (process.env.NODE_ENV !== 'production' && _prisma) {
  globalForPrisma.prisma = _prisma;
}

/** Check if the database connection is available */
export function isDbAvailable(): boolean {
  return _prisma !== null && _prisma !== undefined;
}

/** 
 * Get a non-nullable PrismaClient instance.
 * Always call isDbAvailable() first and return a fallback response if false.
 * Throws if called when DB is not available.
 */
export function getPrisma(): PrismaClient {
  if (!_prisma) {
    throw new Error('Database is not available. Check isDbAvailable() before calling getPrisma().');
  }
  return _prisma;
}

// Legacy export for backward compatibility (deprecated — use getPrisma() instead)
export const prisma = _prisma;
