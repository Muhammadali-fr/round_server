-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "cartId" TEXT;

-- CreateTable
CREATE TABLE "public"."Cart" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
