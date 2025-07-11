/*
  Warnings:

  - You are about to drop the column `coins` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationAttempts` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationScore` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "coins",
DROP COLUMN "username",
DROP COLUMN "verificationAttempts",
DROP COLUMN "verificationScore";
