import { useState } from "react";

export const useFetchTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/tasks`);

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      return { success: true, data };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete task";
      setError(message || "Failed to fetch task");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchTask,
    loading,
    error,
  };
};
