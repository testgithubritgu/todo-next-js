import { db } from "@/config/db";
import { todo } from "@/config/schema";
import { taskSchema } from "@/lib/validators/taskSchema";
import { NextResponse } from "next/server";

export async function GET() {
  const tasks = await db.select().from(todo);
  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = taskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await db.insert(todo).values({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}