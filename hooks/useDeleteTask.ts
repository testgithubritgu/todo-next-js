import { useState } from "react";
import { useRouter } from "next/navigation";

export const useDeleteTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const deleteTask = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete task");

      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete task";
      setError(message);
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
