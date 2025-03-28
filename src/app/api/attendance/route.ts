import { PrismaClient, LogType } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { employeeId, logType, timestamp } = await req.json();

    const attendanceLog = await prisma.attendanceLog.create({
      data: {
        employee_id: parseInt(employeeId),
        log_type: logType as LogType,
        timestamp: new Date(timestamp),
      },
    });

    return NextResponse.json(attendanceLog, { status: 201 });
  } catch (error) {
    console.error('Error creating attendance log:', error);
    return NextResponse.json(
      { message: "打刻の登録に失敗しました" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 