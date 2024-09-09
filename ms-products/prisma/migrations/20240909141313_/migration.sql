/*
  Warnings:

  - A unique constraint covering the columns `[icon]` on the table `TBL_CATEGORIES` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `TBL_CATEGORIES` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `TBL_SUBCATEGORIES` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `icon` to the `TBL_CATEGORIES` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `TBL_CATEGORIES` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `TBL_CATEGORIES` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `TBL_SUBCATEGORIES` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TBL_CATEGORIES" ADD COLUMN     "icon" VARCHAR(250) NOT NULL,
ADD COLUMN     "tags" VARCHAR(300) NOT NULL,
ADD COLUMN     "url" VARCHAR(250) NOT NULL;

-- AlterTable
ALTER TABLE "TBL_SUBCATEGORIES" ADD COLUMN     "url" VARCHAR(250) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TBL_CATEGORIES_icon_key" ON "TBL_CATEGORIES"("icon");

-- CreateIndex
CREATE UNIQUE INDEX "TBL_CATEGORIES_url_key" ON "TBL_CATEGORIES"("url");

-- CreateIndex
CREATE UNIQUE INDEX "TBL_SUBCATEGORIES_url_key" ON "TBL_SUBCATEGORIES"("url");
