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

export async function GET(req: Request, { params }: { params: Promise<{ employeeId: string }> }) {
  try {
    await main();
    const resolvedParams = await params;
    const employee = await prisma.employee.findUnique({
      where: {
        employee_id: parseInt(resolvedParams.employeeId),
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "従業員が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        employee_id: employee.employee_id,
        name: employee.name
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "従業員情報の取得に失敗しました", err },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 