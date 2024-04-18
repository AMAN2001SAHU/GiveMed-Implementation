/*
  Warnings:

  - You are about to drop the column `medicineId` on the `donation` table. All the data in the column will be lost.
  - Added the required column `dose` to the `donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expDate` to the `donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mfgDate` to the `donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `donation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "donation" DROP CONSTRAINT "donation_medicineId_fkey";

-- AlterTable
ALTER TABLE "donation" DROP COLUMN "medicineId",
ADD COLUMN     "dose" TEXT NOT NULL,
ADD COLUMN     "expDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "mfgDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;
