
import { revalidateMyPath } from "@/app/actions/revalidate-path";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const useDeleteTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const deleteTask = async (id: string) => {
    
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      
   
     
    
      setLoading(false);
      window.location.reload()
    
  };

  return {
    deleteTask,
    loading,
    error,
  };
};
