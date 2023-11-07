/*
  Warnings:

  - You are about to drop the `PublicAddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PublicAddress" DROP CONSTRAINT "PublicAddress_wallet_id_fkey";

-- DropTable
DROP TABLE "PublicAddress";

-- CreateTable
CREATE TABLE "public_address" (
    "id" TEXT NOT NULL,
    "wallet_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public_address" ADD CONSTRAINT "public_address_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
