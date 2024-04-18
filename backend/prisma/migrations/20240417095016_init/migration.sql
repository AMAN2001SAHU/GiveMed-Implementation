-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fname" TEXT,
    "lname" TEXT,
    "address" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicines" (
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

    CONSTRAINT "medicines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
