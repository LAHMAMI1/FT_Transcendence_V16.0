-- AlterTable
ALTER TABLE "User" ADD COLUMN "two_factor_email_code" TEXT;
ALTER TABLE "User" ADD COLUMN "two_factor_email_expires" DATETIME;
