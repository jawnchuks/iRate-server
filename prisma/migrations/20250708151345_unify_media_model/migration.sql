/*
  Warnings:

  - You are about to drop the column `profilePictureId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserPhoto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profilePictureId_fkey";

-- DropForeignKey
ALTER TABLE "UserPhoto" DROP CONSTRAINT "UserPhoto_userId_fkey";

-- DropIndex
DROP INDEX "User_profilePictureId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profilePictureId",
ADD COLUMN     "profilePicture" TEXT;

-- DropTable
DROP TABLE "UserPhoto";
