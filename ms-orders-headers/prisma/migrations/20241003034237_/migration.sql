/*
  Warnings:

  - Added the required column `color` to the `TBL_PURCHARSE_ORDER_ITEMS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `TBL_PURCHARSE_ORDER_ITEMS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TBL_PURCHARSE_ORDER_ITEMS" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;
