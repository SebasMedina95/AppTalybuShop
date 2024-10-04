/*
  Warnings:

  - Added the required column `percentDiscount` to the `TBL_PURCHARSE_ORDER_ITEMS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TBL_PURCHARSE_ORDER_ITEMS" ADD COLUMN     "isDiscount" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "percentDiscount" DOUBLE PRECISION NOT NULL;
