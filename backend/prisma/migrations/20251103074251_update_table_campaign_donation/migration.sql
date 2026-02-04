/*
  Warnings:

  - The `status` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `category` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentStatus` column on the `Donation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `zakatPercent` on the `Zakat` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,2)`.

*/
-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('active', 'closed', 'draft');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('pending', 'paid', 'failed');

-- CreateEnum
CREATE TYPE "CampaignCategory" AS ENUM ('zakat', 'fidyah', 'qurban', 'umum');

-- DropForeignKey
ALTER TABLE "public"."Fidyah" DROP CONSTRAINT "Fidyah_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Qurban" DROP CONSTRAINT "Qurban_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Zakat" DROP CONSTRAINT "Zakat_campaignId_fkey";

-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "targetAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "collectedAmount" DROP DEFAULT,
ALTER COLUMN "collectedAmount" SET DATA TYPE DECIMAL(12,2),
DROP COLUMN "status",
ADD COLUMN     "status" "CampaignStatus" NOT NULL DEFAULT 'active',
DROP COLUMN "category",
ADD COLUMN     "category" "CampaignCategory";

-- AlterTable
ALTER TABLE "Donation" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2),
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "DonationStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Fidyah" ALTER COLUMN "amountPerDay" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Qurban" ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Zakat" ALTER COLUMN "nisabValue" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "zakatPercent" SET DATA TYPE DECIMAL(5,2);

-- AddForeignKey
ALTER TABLE "Zakat" ADD CONSTRAINT "Zakat_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fidyah" ADD CONSTRAINT "Fidyah_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qurban" ADD CONSTRAINT "Qurban_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
