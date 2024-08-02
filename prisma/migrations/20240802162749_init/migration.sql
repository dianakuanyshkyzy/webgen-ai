/*
  Warnings:

  - The primary key for the `Wish` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Wish` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `wishId` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_wishId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "wishId",
ADD COLUMN     "wishId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Wish" DROP CONSTRAINT "Wish_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Wish_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_wishId_fkey" FOREIGN KEY ("wishId") REFERENCES "Wish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
