-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "total_price" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "resources" ADD COLUMN     "facilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "price_per_night" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "room_images" (
    "id" UUID NOT NULL,
    "resource_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "room_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "payment_method" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "paid_at" TIMESTAMP(6),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_booking_id_key" ON "payments"("booking_id");

-- AddForeignKey
ALTER TABLE "room_images" ADD CONSTRAINT "room_images_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
