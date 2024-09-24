/*
  Warnings:

  - Changed the type of `sizes` on the `TBL_PRODUCTS` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TBL_PRODUCTS" DROP COLUMN "sizes",
ADD COLUMN     "sizes" VARCHAR(500) NOT NULL;
