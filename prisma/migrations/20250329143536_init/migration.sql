/*
  Warnings:

  - A unique constraint covering the columns `[assignment_id,log_type]` on the table `AttendanceLog` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employee_id,work_date,location_id]` on the table `WorkRecord` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assignment_id` to the `AttendanceLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_id` to the `AttendanceLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AttendanceLog" ADD COLUMN     "assignment_id" INTEGER NOT NULL,
ADD COLUMN     "location_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceLog_assignment_id_log_type_key" ON "AttendanceLog"("assignment_id", "log_type");

-- CreateIndex
CREATE UNIQUE INDEX "WorkRecord_employee_id_work_date_location_id_key" ON "WorkRecord"("employee_id", "work_date", "location_id");

-- AddForeignKey
ALTER TABLE "AttendanceLog" ADD CONSTRAINT "AttendanceLog_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "Assignment"("assignment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceLog" ADD CONSTRAINT "AttendanceLog_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;
