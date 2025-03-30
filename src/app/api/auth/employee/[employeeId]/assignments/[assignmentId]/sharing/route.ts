//案件ごとの情報共有の取得API
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: { employeeId: string, assignmentId: string } }
) {
  try {
    // paramsを非同期で取得
    const params = await context.params;
    const assignmentId = parseInt(params.assignmentId);

    // AssignmentからLocation IDを取得
    const assignment = await prisma.assignment.findUnique({
      where: {
        assignment_id: assignmentId
      },
      select: {
        location_id: true
      }
    });

    if (!assignment) {
      return NextResponse.json(
        { error: '指定された案件が見つかりません' },
        { status: 404 }
      );
    }

    // 該当LocationのCardBenefitを取得
    const benefits = await prisma.cardBenefit.findMany({
      where: {
        location_id: assignment.location_id,
        OR: [
          { end_date: null },
          { end_date: { gte: new Date() } }
        ]
      },
      include: {
        location: {
          select: {
            location_name: true
          }
        }
      },
      orderBy: [
        { is_limited_stock: 'desc' },  // 数量限定を優先表示
        { created_at: 'desc' }         // 新しい順
      ]
    });

    return NextResponse.json({ benefits });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}