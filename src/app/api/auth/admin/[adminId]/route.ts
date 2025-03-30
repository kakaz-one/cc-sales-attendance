import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// main関数を削除し、DB接続を直接行う
// 型定義を修正
type Context = {
  params: Promise<{
    adminId: string;
  }>;
};

// パラメータの型を修正
export async function GET(
  request: Request,
  context: Context
) {
  try {
    // paramsをawaitで取得
    const { adminId } = await context.params;
    const parsedAdminId = parseInt(adminId);

    await prisma.$connect();

    const admin = await prisma.employee.findUnique({
      where: {
        employee_id: parsedAdminId,
        is_admin: true
      },
      select: {
        name: true,
        employee_id: true
      }
    });

    if (!admin) {
      return NextResponse.json(
        { message: "管理者が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(admin, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: "管理者情報の取得に失敗しました" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
