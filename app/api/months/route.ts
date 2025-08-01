import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  // TODO: replace with real auth
  const userId = "demo-user";

  try {
    const months = await prisma.month.findMany({
      where: { userId },
      orderBy: [{ year: "asc" }, { month: "asc" }],
    });
    return NextResponse.json(months);
  } catch (err) {
    console.error(err);
    return new NextResponse("Error fetching months", { status: 500 });
  }
}

export async function POST(request: Request) {
  const userId = "demo-user";
  const body = await request.json();
  // Expect array of months
  if (!Array.isArray(body)) {
    return new NextResponse("Invalid payload", { status: 400 });
  }

  try {
    // Upsert months
    const operations = body.map((m: any) =>
      prisma.month.upsert({
        where: { userId_year_month: { userId, year: m.year, month: m.month } },
        update: {
          income: m.income,
          expenses: m.expenses,
          savings: m.savings,
          investments: m.investments,
          notes: m.notes,
        },
        create: {
          userId,
          year: m.year,
          month: m.month,
          income: m.income,
          expenses: m.expenses,
          savings: m.savings,
          investments: m.investments,
          notes: m.notes,
        },
      })
    );

    await Promise.all(operations);
    return new NextResponse("ok");
  } catch (err) {
    console.error(err);
    return new NextResponse("Error saving months", { status: 500 });
  }
}