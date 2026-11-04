import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
try {
  for (const [id, name, content] of [
    ['basics', 'Water basics', 'Explain mineral hardness, measurement and ion exchange clearly for household customers.'],
    ['guidance', 'Product guidance', 'Explain selection using measured hardness, demand, capacity and efficiency.'],
    ['maintenance', 'Maintenance', 'Explain upkeep, salt, regeneration and model-specific manual guidance.']
  ]) {
    await db.systemPrompt.upsert({ where: { id }, update: {}, create: { id, name, content, isDefault: true } });
  }
} finally { await db.$disconnect(); }
