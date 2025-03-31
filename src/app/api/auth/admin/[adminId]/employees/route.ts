import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        employee_id: true,
        name: true,
        role: true,
        is_admin: true
      },
      orderBy: {
        employee_id: 'asc'
      }
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: '従業員データの取得に失敗しました' },
      { status: 500 }
    );
  }
}
