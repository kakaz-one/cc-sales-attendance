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

    // 3日分のアサインメントを取得（日付の範囲を指定）
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
          },
        },
        location: {
          select: {
            location_name: true,
          },
        },
      },
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

