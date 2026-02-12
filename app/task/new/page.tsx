"use client";

import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormValues } from "@/lib/validators/taskSchema";
import { createTask, ActionState } from "@/app/actions/taskActions";

const initialState: ActionState = {
  success: false,
  error: null,
};

const TaskForm = () => {
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

  // ✅ reset ONLY after success
  useEffect(() => {
    if (state.success) {
      reset();
    }
  }, [state.success, reset]);

  return (
    <div className="flex h-screen justify-center items-center">
      <form
        action={formAction}
        className="max-w-md bg-gray-400 p-6 rounded-xl shadow"
      >
        <h2 className="text-xl font-bold mb-4">Create Task</h2>

        {/* Server error */}
        {state.error && !state.success && (
          <p className="text-red-500 text-sm mb-3">{state.error}</p>
        )}

        {/* Title */}
        <div className="mb-4">
          <input
            {...register("title")}
            name="title"
            placeholder="Task title"
            className="w-full border p-2 rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <textarea
            {...register("description")}
            name="description"
            placeholder="Task description"
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          disabled={isPending}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
