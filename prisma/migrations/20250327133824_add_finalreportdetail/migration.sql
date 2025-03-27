/*
  Warnings:

  - You are about to drop the column `select_count` on the `FinalReport` table. All the data in the column will be lost.
  - You are about to drop the column `total_receptions` on the `FinalReport` table. All the data in the column will be lost.
  - You are about to drop the column `vc_count` on the `FinalReport` table. All the data in the column will be lost.
  - Added the required column `receptions_sum` to the `FinalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `select_count_sum` to the `FinalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vc_count_sum` to the `FinalReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FinalReport" DROP COLUMN "select_count",
DROP COLUMN "total_receptions",
DROP COLUMN "vc_count",
ADD COLUMN     "receptions_sum" INTEGER NOT NULL,
ADD COLUMN     "select_count_sum" INTEGER NOT NULL,
ADD COLUMN     "vc_count_sum" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "FinalReportDetail" (
    "detail_id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "receptions" INTEGER NOT NULL,
    "vc_count" INTEGER NOT NULL,
    "select_count" INTEGER NOT NULL,

    CONSTRAINT "FinalReportDetail_pkey" PRIMARY KEY ("detail_id")
);

-- AddForeignKey
ALTER TABLE "FinalReportDetail" ADD CONSTRAINT "FinalReportDetail_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "FinalReport"("report_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalReportDetail" ADD CONSTRAINT "FinalReportDetail_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;
