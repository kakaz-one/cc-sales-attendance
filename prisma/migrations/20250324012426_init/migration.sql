-- CreateEnum
CREATE TYPE "Role" AS ENUM ('社員', '契約社員', 'バイト');

-- CreateEnum
CREATE TYPE "SalaryType" AS ENUM ('hourly', 'monthly');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('男性', '女性', 'その他');

-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('出勤', '退勤', '前日確認', '出発');

-- CreateEnum
CREATE TYPE "ShiftPreference" AS ENUM ('入れる', '微妙', '入れない');

-- CreateTable
CREATE TABLE "Employee" (
    "employee_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "salary_type" "SalaryType" NOT NULL,
    "monthly_salary" INTEGER,
    "base_hourly_wage" INTEGER,
    "hire_date" TIMESTAMP(3) NOT NULL,
    "gender" "Gender",
    "birth_date" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "Location" (
    "location_id" SERIAL NOT NULL,
    "location_name" TEXT NOT NULL,
    "address" TEXT,
    "max_assignees" INTEGER NOT NULL,
    "default_start_time" TIMESTAMP(3),
    "default_end_time" TIMESTAMP(3),

    CONSTRAINT "Location_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "AssignmentRequest" (
    "request_id" SERIAL NOT NULL,
    "location_id" INTEGER NOT NULL,
    "requested_date" TIMESTAMP(3) NOT NULL,
    "custom_requested_count" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentRequest_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "assignment_id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "work_date" TIMESTAMP(3) NOT NULL,
    "location_id" INTEGER NOT NULL,
    "planned_start_time" TIMESTAMP(3),
    "planned_end_time" TIMESTAMP(3),

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "AttendanceLog" (
    "log_id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "log_type" "LogType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceLog_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "WorkRecord" (
    "work_id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "work_date" TIMESTAMP(3) NOT NULL,
    "clock_in_time" TIMESTAMP(3),
    "clock_out_time" TIMESTAMP(3),
    "working_hours" DOUBLE PRECISION,
    "transportation_fee" INTEGER NOT NULL DEFAULT 0,
    "location_id" INTEGER NOT NULL,

    CONSTRAINT "WorkRecord_pkey" PRIMARY KEY ("work_id")
);

-- CreateTable
CREATE TABLE "ShiftRequest" (
    "request_id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "request_date" TIMESTAMP(3) NOT NULL,
    "preference" "ShiftPreference" NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShiftRequest_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "CardBenefit" (
    "benefit_id" SERIAL NOT NULL,
    "location_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "is_limited_stock" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardBenefit_pkey" PRIMARY KEY ("benefit_id")
);

-- CreateTable
CREATE TABLE "FinalReport" (
    "report_id" SERIAL NOT NULL,
    "work_date" TIMESTAMP(3) NOT NULL,
    "location_id" INTEGER NOT NULL,
    "reporter_id" INTEGER NOT NULL,
    "total_receptions" INTEGER NOT NULL,
    "vc_count" INTEGER NOT NULL,
    "select_count" INTEGER NOT NULL,
    "note" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinalReport_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "PeakPeriodRule" (
    "rule_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "min_days_required" INTEGER NOT NULL,
    "require_full_attendance" BOOLEAN NOT NULL DEFAULT false,
    "target_role" "Role" NOT NULL DEFAULT 'バイト',
    "peak_hourly_wage" INTEGER NOT NULL,
    "applies_to_month" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeakPeriodRule_pkey" PRIMARY KEY ("rule_id")
);

-- AddForeignKey
ALTER TABLE "AssignmentRequest" ADD CONSTRAINT "AssignmentRequest_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceLog" ADD CONSTRAINT "AttendanceLog_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkRecord" ADD CONSTRAINT "WorkRecord_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkRecord" ADD CONSTRAINT "WorkRecord_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftRequest" ADD CONSTRAINT "ShiftRequest_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBenefit" ADD CONSTRAINT "CardBenefit_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalReport" ADD CONSTRAINT "FinalReport_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalReport" ADD CONSTRAINT "FinalReport_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;
