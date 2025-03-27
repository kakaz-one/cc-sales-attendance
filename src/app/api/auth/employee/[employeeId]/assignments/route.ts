//担当案件の一覧を取得のAPI
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  //  { params }: { params: { employeeId: string } }
  //Next.js 15ではparamsがPromiseになり、React.use()を使用して値を取得する必要がある。そのため上記ではなく、以下のように記述します。
  { params }: { params: Promise<{ employeeId: string }> }
) {
  try {
    const resolvedParams = await params;
    const employeeId = parseInt(resolvedParams.employeeId);
    if (isNaN(employeeId)) {
      return NextResponse.json({ error: '無効な従業員IDです' }, { status: 400 });
    }

    // 現在の月の開始日と終了日を取得
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // 従業員の案件一覧を取得
    const assignments = await prisma.assignment.findMany({
      where: {
        employee_id: employeeId,
        work_date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        location: true,
      },
      orderBy: {
        work_date: 'asc',
      },
    });

    // レスポンスデータを整形
    const formattedAssignments = assignments.map(assignment => {
      // 開始時間の設定
      let startTime = assignment.planned_start_time;
      if (!startTime && assignment.location.default_start_time) {
        const [hours, minutes] = assignment.location.default_start_time.split(':');
        startTime = new Date(assignment.work_date);
        startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      }

      // 終了時間の設定
      let endTime = assignment.planned_end_time;
      if (!endTime && assignment.location.default_end_time) {
        const [hours, minutes] = assignment.location.default_end_time.split(':');
        endTime = new Date(assignment.work_date);
        endTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      }

      return {
        assignmentId: assignment.assignment_id,
        workDate: assignment.work_date.toISOString(),
        locationName: assignment.location.location_name,
        plannedStartTime: startTime?.toISOString() || null,
        plannedEndTime: endTime?.toISOString() || null,
      };
    });

    return NextResponse.json({ assignments: formattedAssignments });
  } catch (error) {
    console.error('案件一覧取得エラー:', error);
    return NextResponse.json(
      { error: '案件一覧の取得に失敗しました' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}