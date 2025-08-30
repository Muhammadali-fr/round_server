-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_UserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product_images" DROP CONSTRAINT "Product_images_productId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product_images" ADD CONSTRAINT "Product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
