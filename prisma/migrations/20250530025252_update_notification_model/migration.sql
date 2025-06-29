/*
  Warnings:

  - You are about to drop the column `priority` on the `Notification` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RATING', 'MESSAGE', 'CHAT_REQUEST', 'SYSTEM', 'VERIFICATION', 'PROFILE_UPDATE');

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "priority",
DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL;
