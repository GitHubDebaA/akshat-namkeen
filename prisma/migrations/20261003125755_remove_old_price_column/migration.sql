/*
  Warnings:

  - You are about to drop the column `price` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to alter the column `mrp` on the `ProductVariant` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `sellingPrice` on the `ProductVariant` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - Made the column `mrp` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sellingPrice` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "price",
ALTER COLUMN "mrp" SET NOT NULL,
ALTER COLUMN "mrp" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "sellingPrice" SET NOT NULL,
ALTER COLUMN "sellingPrice" SET DATA TYPE DECIMAL(65,30);
