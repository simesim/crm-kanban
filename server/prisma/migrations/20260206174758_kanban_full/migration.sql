/*
  Warnings:

  - You are about to drop the column `createdById` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[columnId,order]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[boardId,order]` on the table `Column` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `BoardMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Column` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BoardRole" AS ENUM ('MANAGER', 'LEAD');

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_createdById_fkey";

-- DropIndex
DROP INDEX "Board_ownerId_idx";

-- DropIndex
DROP INDEX "BoardMember_userId_idx";

-- DropIndex
DROP INDEX "Card_boardId_idx";

-- DropIndex
DROP INDEX "Card_columnId_idx";

-- DropIndex
DROP INDEX "Card_columnId_position_key";

-- DropIndex
DROP INDEX "Column_boardId_idx";

-- DropIndex
DROP INDEX "Column_boardId_position_key";

-- AlterTable
ALTER TABLE "BoardMember" ADD COLUMN     "role" "Role" NOT NULL;

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "createdById",
DROP COLUMN "position",
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "checklist" JSONB,
ADD COLUMN     "course" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "tags" JSONB,
ADD COLUMN     "timePreferences" JSONB,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Column" DROP COLUMN "position",
ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordHash",
DROP COLUMN "role",
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Card_columnId_order_key" ON "Card"("columnId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Column_boardId_order_key" ON "Column"("boardId", "order");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
