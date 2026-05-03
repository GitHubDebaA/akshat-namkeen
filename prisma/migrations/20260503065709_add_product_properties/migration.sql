-- CreateTable
CREATE TABLE "ProductProperty" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "valueType" TEXT,
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductProperty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductProperty_productId_idx" ON "ProductProperty"("productId");

-- AddForeignKey
ALTER TABLE "ProductProperty" ADD CONSTRAINT "ProductProperty_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
