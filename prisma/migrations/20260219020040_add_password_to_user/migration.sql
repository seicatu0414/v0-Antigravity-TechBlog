/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Step 1: Add column as nullable
ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- Step 2: Backfill data (Set a default password or temporary value for existing users)
-- Note: This 'temporary_password' should ideally be a hashed string if your app requires it,
-- but for migration safety we just ensure it's not null.
UPDATE "User" SET "password" = '$2b$10$Mg3eJbOy67Dk5u8KA2frQuc/6sAejle7AmU/CodkMfY/eQs5bHPVK' WHERE "password" IS NULL;

-- Step 3: Add NOT NULL constraint
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;
