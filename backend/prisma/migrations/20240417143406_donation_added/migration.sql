/*
  Warnings:

  - You are about to drop the `medicines` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "medicines";

-- CreateTable
CREATE TABLE "Medicines" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "prescription" VARCHAR(50),
    "sell_type" VARCHAR(100),
    "manufacturer" VARCHAR(255),
    "salt" VARCHAR(255),
    "mrp" VARCHAR(20),
    "uses" TEXT,
    "alternate_medicines" TEXT,
    "side_effects" TEXT,
    "how_to_use" TEXT,
    "chemical_class" VARCHAR(100),
    "habit_forming" VARCHAR(3),
    "therapeutic_class" VARCHAR(100),
    "action_class" VARCHAR(100),
    "how_it_works" TEXT,

    CONSTRAINT "Medicines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "medicineId" INTEGER NOT NULL,
    "donationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
