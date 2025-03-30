import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

// 従業員情報全件取得のAPI
export const GET = async () => {
  try {
    await prisma.$connect();
    const employees = await prisma.employee.findMany();
    return NextResponse.json(
      { message: "Success", employees },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed", err },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

// 従業員ログインのAPI
export const POST = async (req: Request) => {
  try {
    await prisma.$connect();
    const { adminId, password } = await req.json();
    console.log('ログインリクエスト:', { adminId, password });

    const employee = await prisma.employee.findUnique({
      where: {
        employee_id: parseInt(adminId)
      }
    });
    console.log('従業員データ:', employee);

    if (!employee) {
      console.log('従業員が見つかりません');
      return NextResponse.json(
        { message: "管理者IDまたはパスワードが正しくありません" },
        { status: 401 }
      );
    }

    const isValid = password === employee.password;
    console.log('パスワード検証結果:', isValid);

    if (!isValid) {
      console.log('パスワードが一致しません');
      return NextResponse.json(
        { message: "管理者IDまたはパスワードが正しくありません" },
        { status: 401 }
      );
    }

    if (!employee.is_admin) {
      console.log('管理者権限がありません');
      return NextResponse.json(
        { message: "管理者権限がありません" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        message: "ログイン成功",
        adminId: employee.employee_id,
        name: employee.name
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('ログインエラー:', err);
    return NextResponse.json(
      { message: "ログイン処理に失敗しました" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
