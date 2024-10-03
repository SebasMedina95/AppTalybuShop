/*
  Warnings:

  - You are about to drop the column `tBL_PURCHASE_ORDERId` on the `TBL_PURCHARSE_ORDER_ITEMS` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TBL_PURCHARSE_ORDER_ITEMS" DROP CONSTRAINT "TBL_PURCHARSE_ORDER_ITEMS_tBL_PURCHASE_ORDERId_fkey";

-- AlterTable
ALTER TABLE "TBL_PURCHARSE_ORDER_ITEMS" DROP COLUMN "tBL_PURCHASE_ORDERId",
ADD COLUMN     "orderPurchaseId" INTEGER;

-- AddForeignKey
ALTER TABLE "TBL_PURCHARSE_ORDER_ITEMS" ADD CONSTRAINT "TBL_PURCHARSE_ORDER_ITEMS_orderPurchaseId_fkey" FOREIGN KEY ("orderPurchaseId") REFERENCES "TBL_PURCHASE_ORDER"("id") ON DELETE SET NULL ON UPDATE CASCADE;
