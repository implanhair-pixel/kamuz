-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "passwordHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VoiceRecording" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dialect" TEXT NOT NULL DEFAULT 'sorani',
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "duration" REAL NOT NULL DEFAULT 0,
    "ipHash" TEXT NOT NULL,
    "nickname" TEXT NOT NULL DEFAULT 'ناشناس',
    "userId" TEXT,
    "vocabId" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "avgRating" REAL NOT NULL DEFAULT 0,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "totalScore" REAL NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VoiceRecording_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VoiceRating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "voiceId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'like',
    "userId" TEXT,
    "ipHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VoiceRating_voiceId_fkey" FOREIGN KEY ("voiceId") REFERENCES "VoiceRecording" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ipHash" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "resetAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AdminLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "targetId" TEXT,
    "detail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SavedWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "vocabId" TEXT NOT NULL,
    "savedAt" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VoiceRating_voiceId_userId_key" ON "VoiceRating"("voiceId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "RateLimit_ipHash_action_key" ON "RateLimit"("ipHash", "action");

-- CreateIndex
CREATE INDEX "SavedWord_userId_idx" ON "SavedWord"("userId");

-- CreateIndex
CREATE INDEX "SavedWord_vocabId_idx" ON "SavedWord"("vocabId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedWord_userId_vocabId_key" ON "SavedWord"("userId", "vocabId");
