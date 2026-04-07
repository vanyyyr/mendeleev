import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // For Supabase + Vercel, use the pooled connection string
  // Try DATABASE_URL (pooler), then DIRECT_URL (direct), then POSTGRES_URL
  let connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
  
  if (!connectionString) {
    throw new Error('No database connection string found. Check DATABASE_URL, DIRECT_URL, or POSTGRES_URL environment variables.');
  }

  const pool = new Pool({ 
    connectionString,
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 15000,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const _prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production' && _prisma) {
  globalForPrisma.prisma = _prisma;
}

export const prisma = _prisma;

// Legacy export for backward compatibility
export function isDbAvailable(): boolean {
  return _prisma !== null && _prisma !== undefined;
}

export function getPrisma(): PrismaClient {
  if (!_prisma) {
    throw new Error('Database is not available. Check connection and environment variables.');
  }
  return _prisma;
}
