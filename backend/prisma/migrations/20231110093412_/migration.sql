/*
  Warnings:

  - A unique constraint covering the columns `[wallet_id]` on the table `public_address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "public_address_wallet_id_key" ON "public_address"("wallet_id");
