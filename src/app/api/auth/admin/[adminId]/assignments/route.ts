//アサイン状況確認API

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function main() {
  try {
    await prisma.$connect();
  } catch (err) {
    return Error("DB接続に失敗しました");
  }
}

export async function GET(
  request: Request,
  { params }: { params: { adminId: string } }
) {
  try {
    // 日付の計算（時刻を00:00:00に設定）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // 全ての場所を取得
    const locations = await prisma.location.findMany({
      select: {
        location_id: true,
        location_name: true,
      },
    });

    // 3日分のアサインメントを取得（従業員の詳細情報も含める）
    const assignments = await prisma.assignment.findMany({
      where: {
        work_date: {
          gte: yesterday,
          lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      include: {
        employee: {
          select: {
            name: true,
            role: true,
            hire_date: true,
          },
        },
        location: {
          select: {
            location_name: true,
          },
        },
      },
      orderBy: [
        {
          employee: {
            role: 'asc', // 社員が先頭に来るように
          },
        },
        {
          employee: {
            hire_date: 'asc', // 同じroleの場合は入社日が早い順
          },
        },
      ],
    });

    return NextResponse.json({
      locations,
      assignments,
      dates: {
        yesterday: yesterday.toISOString(),
        today: today.toISOString(),
        tomorrow: tomorrow.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: 'アサイン情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}

