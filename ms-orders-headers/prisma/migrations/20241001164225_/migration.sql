/*
  Warnings:

  - You are about to drop the column `createAt` on the `TBL_PURCHASE_ORDER` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `TBL_PURCHASE_ORDER` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TBL_PURCHASE_ORDER" DROP COLUMN "createAt",
DROP COLUMN "updateAt",
ADD COLUMN     "createDateAt" TIMESTAMP(3),
ADD COLUMN     "updateDateAt" TIMESTAMP(3),
ADD COLUMN     "userCreateAt" VARCHAR(30),
ADD COLUMN     "userUpdateAt" VARCHAR(30);
