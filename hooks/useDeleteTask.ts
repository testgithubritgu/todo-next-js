import { useState } from "react";

export const useDeleteTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTask = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      return { success: true };
    } catch (err: any) {
      setError(err.message || "Failed to delete task");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteTask,
    loading,
    error,
  };
};
