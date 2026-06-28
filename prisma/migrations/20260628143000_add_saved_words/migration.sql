-- Create SavedWord table
CREATE TABLE "SavedWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "vocabId" TEXT NOT NULL,
    "savedAt" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes
CREATE INDEX "SavedWord_userId_idx" ON "SavedWord"("userId");
CREATE INDEX "SavedWord_vocabId_idx" ON "SavedWord"("vocabId");
CREATE UNIQUE INDEX "SavedWord_userId_vocabId_key" ON "SavedWord"("userId", "vocabId");
