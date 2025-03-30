//従業員ページログインAPI
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function main() {
  try {
    await prisma.$connect();
  } catch (_err) {
    return Error("DB接続に失敗しました");
  }
}

// 従業員情報全件取得のAPI
export const GET = async () => {
  try {
    await main();
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
    await main();
    const { employeeId, password } = await req.json();
    console.log('ログインリクエスト:', { employeeId, password });

    const employee = await prisma.employee.findUnique({
      where: {
        employee_id: parseInt(employeeId)
      }
    });
    console.log('従業員データ:', employee);

    if (!employee) {
      console.log('従業員が見つかりません');
      return NextResponse.json(
        { message: "従業員IDまたはパスワードが正しくありません" },
        { status: 401 }
      );
    }

    console.log('input:', password);
    console.log('password:', employee.password);
    const isValid = password == employee.password;
    console.log('パスワード検証結果:', isValid);

    if (!isValid) {
      console.log('パスワードが一致しません');
      return NextResponse.json(
        { message: "従業員IDまたはパスワードが正しくありません" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        message: "ログイン成功",
        employeeId: employee.employee_id,
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