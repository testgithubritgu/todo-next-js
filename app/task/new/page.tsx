"use client";

import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormValues } from "@/lib/validators/taskSchema";
import { createTask, ActionState } from "@/app/actions/taskActions";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

const initialState: ActionState = {
  success: false,
  error: null,
};

const TaskForm = () => {
  const queryClient = useQueryClient();
  const [state, formAction, isPending] = useActionState(
    createTask,
    initialState
  );

  const {
    register,
    formState: { errors },
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    if (state.success) {
      reset();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  }, [state.success, reset, queryClient]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-10">
        {/* Back link */}
        <Link
          href="/task"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to tasks
        </Link>

        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Create Task</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a new task to your list.
          </p>
        </div>

        {/* Success message */}
        {state.success && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0" />
            Task created successfully!
          </div>
        )}

        {/* Server error */}
        {state.error && !state.success && (
          <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
            {state.error}
          </div>
        )}

        {/* Form */}
        <Card>
          <CardContent className="p-6">
            <form action={formAction} className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register("title")}
                  name="title"
                  placeholder="e.g. Buy groceries"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  name="description"
                  placeholder="Add some details about your task..."
                  rows={4}
                />
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="size-4 animate-spin" />}
                {isPending ? "Saving..." : "Save Task"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskForm;
