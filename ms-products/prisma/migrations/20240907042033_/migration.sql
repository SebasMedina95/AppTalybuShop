-- DropEnum
DROP TYPE "ValidGenders";

-- DropEnum
DROP TYPE "ValidSizes";

-- DropEnum
DROP TYPE "ValidTypes";

-- CreateTable
CREATE TABLE "TBL_SUBCATEGORIES" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "userCreateAt" VARCHAR(30),
    "createDateAt" TIMESTAMP(3),
    "userUpdateAt" VARCHAR(30),
    "updateDateAt" TIMESTAMP(3),
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "TBL_SUBCATEGORIES_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TBL_SUBCATEGORIES_name_key" ON "TBL_SUBCATEGORIES"("name");

-- AddForeignKey
ALTER TABLE "TBL_SUBCATEGORIES" ADD CONSTRAINT "TBL_SUBCATEGORIES_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TBL_CATEGORIES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
