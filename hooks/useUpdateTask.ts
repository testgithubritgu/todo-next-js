import { useState } from "react";
import { TaskFormValues } from "@/lib/validators/taskSchema";

export const useUpdateTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTask = async (id: string, payload: TaskFormValues) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      return { success: true };
    } catch (err:any) {
      setError(err.message || "Failed to update task");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateTask,
    loading,
    error,
  };
};
