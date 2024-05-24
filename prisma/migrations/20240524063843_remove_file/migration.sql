/*
  Warnings:

  - You are about to drop the column `profilePictureId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_taskId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profilePictureId_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "file" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profilePictureId",
ADD COLUMN     "profilePicture" TEXT;

-- DropTable
DROP TABLE "File";
