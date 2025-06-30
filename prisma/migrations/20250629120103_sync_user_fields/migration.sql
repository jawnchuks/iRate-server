/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `participant1Id` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `participant2Id` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Reaction` table. All the data in the column will be lost.
  - Added the required column `tier` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('STANDARD', 'PREMIUM');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MessageType" ADD VALUE 'FILE';
ALTER TYPE "MessageType" ADD VALUE 'VOICE_NOTE';
ALTER TYPE "MessageType" ADD VALUE 'CALL';
ALTER TYPE "MessageType" ADD VALUE 'SYSTEM';

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_participant1Id_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_participant2Id_fkey";

-- DropIndex
DROP INDEX "Conversation_participant1Id_idx";

-- DropIndex
DROP INDEX "Conversation_participant2Id_idx";

-- DropIndex
DROP INDEX "Message_conversationId_idx";

-- DropIndex
DROP INDEX "Message_senderId_idx";

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "conversationId";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "participant1Id",
DROP COLUMN "participant2Id";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "read",
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mediaUrl" TEXT,
ADD COLUMN     "viewOnce" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "benefits" TEXT[],
ADD COLUMN     "tier" "SubscriptionTier" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "biggestWin" TEXT,
ADD COLUMN     "coins" INTEGER,
ADD COLUMN     "energyEmoji" TEXT,
ADD COLUMN     "ethnicity" TEXT,
ADD COLUMN     "mission" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "passions" TEXT[],
ADD COLUMN     "relationshipStatus" TEXT,
ADD COLUMN     "religion" TEXT,
ADD COLUMN     "school" TEXT,
ADD COLUMN     "vibeCheckAnswers" JSONB,
ADD COLUMN     "work" TEXT,
ADD COLUMN     "zodiacSign" TEXT;

-- CreateTable
CREATE TABLE "MessageEvent" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "initiatorId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConversationParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ConversationParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ConversationParticipants_B_index" ON "_ConversationParticipants"("B");

-- AddForeignKey
ALTER TABLE "MessageEvent" ADD CONSTRAINT "MessageEvent_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationParticipants" ADD CONSTRAINT "_ConversationParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationParticipants" ADD CONSTRAINT "_ConversationParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
