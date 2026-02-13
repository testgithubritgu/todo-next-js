import { db } from "@/config/db";
import { todo } from "@/config/schema";
import { taskSchema } from "@/lib/validators/taskSchema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
    try {
        const {id} = await params
        const body = await req.json()
        const parsed = taskSchema.safeParse(body)
         if (!parsed.success) {
           return NextResponse.json(
             { error: parsed.error.issues[0].message },
             { status: 400 },
           );
         }
         await db.update(todo).set({
            title:parsed.data.title,
            description:parsed.data.description ?? null
         }).where(eq(todo.id,id))

         return NextResponse.json({success:true})

    } catch (error) {
          return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
          );
    }
}

export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){
  const {id} =  await params
  
    await db.delete(todo).where(eq(todo.id, id));
    return NextResponse.json({success:true})
}