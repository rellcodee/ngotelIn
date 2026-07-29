/*
  Warnings:

  - A unique constraint covering the columns `[schedule_id]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `resources` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bookings_schedule_id_key" ON "bookings"("schedule_id");

-- CreateIndex
CREATE UNIQUE INDEX "resources_name_key" ON "resources"("name");
