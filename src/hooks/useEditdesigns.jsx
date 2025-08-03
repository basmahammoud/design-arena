// hooks/useEditDesign.js
import { useState } from "react";
import { editAndExportDesign } from "../services/savebuttonserv";

const useEditDesign = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEdit = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await editAndExportDesign(id, data);
      return result;
    } catch (err) {
      setError(err.message || "فشل في التعديل");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleEdit, loading, error };
};

export default useEditDesign;
