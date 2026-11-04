CREATE TABLE "ChatSession" (
 "id" TEXT PRIMARY KEY, "title" TEXT NOT NULL DEFAULT 'New conversation',
 "model" TEXT NOT NULL DEFAULT 'GPT-4 (simulated)', "persona" TEXT NOT NULL DEFAULT 'Water basics',
 "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7, "topP" DOUBLE PRECISION NOT NULL DEFAULT 0.9,
 "generation" INTEGER NOT NULL DEFAULT 0, "pending" BOOLEAN NOT NULL DEFAULT false,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "settings_range" CHECK ("temperature" BETWEEN 0 AND 1 AND "topP" BETWEEN 0 AND 1)
);
CREATE TABLE "Message" (
 "id" TEXT PRIMARY KEY, "sessionId" TEXT NOT NULL, "role" TEXT NOT NULL,
 "content" TEXT NOT NULL, "attachment" JSONB, "model" TEXT, "persona" TEXT,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "message_role" CHECK ("role" IN ('user','assistant')),
 CONSTRAINT "Message_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Message_sessionId_createdAt_idx" ON "Message"("sessionId", "createdAt");
CREATE TABLE "SystemPrompt" (
 "id" TEXT PRIMARY KEY, "name" TEXT NOT NULL, "content" TEXT NOT NULL,
 "isDefault" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "SystemPrompt_name_key" ON "SystemPrompt"("name");
