/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `task` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "TaskState" ADD VALUE 'TEST';

-- AlterTable
ALTER TABLE "task" DROP COLUMN "updatedAt";
