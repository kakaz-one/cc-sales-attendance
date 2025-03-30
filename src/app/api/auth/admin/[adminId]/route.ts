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
  req: Request,
  { params }: { params: { adminId: string } }
) {
  try {
    await main();
    const { adminId } = await params;
    const parsedAdminId = parseInt(adminId);

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
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json(
      { message: "管理者情報の取得に失敗しました" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}