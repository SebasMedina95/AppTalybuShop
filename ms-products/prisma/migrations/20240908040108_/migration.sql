-- CreateEnum
CREATE TYPE "ValidSizes" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'UNIQUE', 'STANDART', 'MEDIUM', 'BIG', 'NA');

-- CreateTable
CREATE TABLE "TBL_PRODUCTS" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "inStock" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "sizes" "ValidSizes"[],
    "slug" VARCHAR(500) NOT NULL,
    "tags" VARCHAR(500) NOT NULL,
    "colors" VARCHAR(500) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "type" VARCHAR(500) NOT NULL,
    "brand" VARCHAR(100) NOT NULL,
    "isDiscount" BOOLEAN DEFAULT false,
    "percentDiscount" DOUBLE PRECISION,
    "discountStartDate" TIMESTAMP(3),
    "discountEndDate" TIMESTAMP(3),
    "is_fragile" BOOLEAN NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "monthsWarranty" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "userCreateAt" VARCHAR(30),
    "createDateAt" TIMESTAMP(3),
    "userUpdateAt" VARCHAR(30),
    "updateDateAt" TIMESTAMP(3),
    "categoryId" INTEGER NOT NULL,
    "subCategoryId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,

    CONSTRAINT "TBL_PRODUCTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TBL_IMAGES" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "userCreateAt" VARCHAR(30),
    "createDateAt" TIMESTAMP(3),
    "productId" INTEGER NOT NULL,

    CONSTRAINT "TBL_IMAGES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TBL_PROVIDERS" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "address" VARCHAR(200),
    "phone1" VARCHAR(40),
    "phone2" VARCHAR(40),
    "email1" VARCHAR(150),
    "email2" VARCHAR(150),
    "description" TEXT,
    "userCreateAt" VARCHAR(30),
    "createDateAt" TIMESTAMP(3),
    "userUpdateAt" VARCHAR(30),
    "updateDateAt" TIMESTAMP(3),

    CONSTRAINT "TBL_PROVIDERS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TBL_PRODUCTS_slug_key" ON "TBL_PRODUCTS"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TBL_PRODUCTS_title_key" ON "TBL_PRODUCTS"("title");

-- CreateIndex
CREATE UNIQUE INDEX "TBL_PROVIDERS_name_key" ON "TBL_PROVIDERS"("name");

-- AddForeignKey
ALTER TABLE "TBL_PRODUCTS" ADD CONSTRAINT "TBL_PRODUCTS_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TBL_CATEGORIES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBL_PRODUCTS" ADD CONSTRAINT "TBL_PRODUCTS_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "TBL_SUBCATEGORIES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBL_PRODUCTS" ADD CONSTRAINT "TBL_PRODUCTS_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "TBL_PROVIDERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBL_IMAGES" ADD CONSTRAINT "TBL_IMAGES_productId_fkey" FOREIGN KEY ("productId") REFERENCES "TBL_PRODUCTS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
