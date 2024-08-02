/*
  Warnings:

  - The primary key for the `Wish` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_wishId_fkey";

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "wishId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Wish" DROP CONSTRAINT "Wish_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Wish_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Wish_id_seq";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_wishId_fkey" FOREIGN KEY ("wishId") REFERENCES "Wish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
