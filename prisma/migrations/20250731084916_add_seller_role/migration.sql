-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SELLER';

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
