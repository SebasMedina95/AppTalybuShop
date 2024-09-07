-- CreateEnum
CREATE TYPE "ValidSizes" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL');

-- CreateEnum
CREATE TYPE "ValidTypes" AS ENUM ('shirts', 'pants', 'hoodies', 'hats');

-- CreateEnum
CREATE TYPE "ValidGenders" AS ENUM ('mens', 'womens', 'childs', 'unisex', 'mix', 'others');

-- CreateTable
CREATE TABLE "TBL_CATEGORIES" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "userCreateAt" VARCHAR(30),
    "createDateAt" TIMESTAMP(3),
    "userUpdateAt" VARCHAR(30),
    "updateDateAt" TIMESTAMP(3),

    CONSTRAINT "TBL_CATEGORIES_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TBL_CATEGORIES_name_key" ON "TBL_CATEGORIES"("name");
