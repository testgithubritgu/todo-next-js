import { revalidatePath } from "next/cache";
import { useState } from "react";

export const useDeleteTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTask = async (id: string) => {
    
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      
   
     
    
      setLoading(false);
      revalidatePath("/tasks")
    
  };

  return {
    deleteTask,
    loading,
    error,
  };
};
