import { PrismaClient } from '@prisma/client';
const globalDb = globalThis as unknown as { softwaterDb?: PrismaClient };
export const db = globalDb.softwaterDb ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalDb.softwaterDb = db;
