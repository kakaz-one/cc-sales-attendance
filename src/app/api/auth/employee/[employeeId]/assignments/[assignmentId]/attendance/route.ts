import { PrismaClient, LogType } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { employeeId: string; assignmentId: string } }
) {
  try {
    const { logType, timestamp } = await req.json();
    const { employeeId, assignmentId } = params;

    // アサインメント情報を取得
    const assignment = await prisma.assignment.findUnique({
      where: {
        assignment_id: parseInt(assignmentId),
      },
      include: {
        location: true,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { message: "アサインメントが見つかりません" },
        { status: 404 }
      );
    }

    const attendanceLog = await prisma.attendanceLog.create({
      data: {
        employee_id: parseInt(employeeId),
        assignment_id: parseInt(assignmentId),
        location_id: assignment.location_id,
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

export async function GET(
  req: Request,
  { params }: { params: { employeeId: string; assignmentId: string } }
) {
  try {
    const { employeeId, assignmentId } = params;

    const attendanceLogs = await prisma.attendanceLog.findMany({
      where: {
        employee_id: parseInt(employeeId),
        assignment_id: parseInt(assignmentId),
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    return NextResponse.json(attendanceLogs);
  } catch (error) {
    console.error('Error fetching attendance logs:', error);
    return NextResponse.json(
      { message: "打刻履歴の取得に失敗しました" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 