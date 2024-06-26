/*
  Warnings:

  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verificationtokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_user_id_fkey`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `password` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `sessions`;

-- DropTable
DROP TABLE `verificationtokens`;
