"use server";

import { db } from "@/config/db";
import { todo } from "@/config/schema";
import { taskSchema } from "@/lib/validators/taskSchema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = {
  success: boolean;
  error: string | null;
};

export async function createTask(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const parsed = taskSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  await db.insert(todo).values({
    title: parsed.data.title,
    description: parsed.data.description ?? null,
  });

  revalidatePath("/task");


  redirect("/task");
}
