import { useState } from "react";
import { storeForCompetition } from "../services/competitionserv";

const useJoinCompetition = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const joinCompetition = async (competitionId, formData) => {
    try {
      setLoading(true);
      setError(null);

      const data = await storeForCompetition(competitionId, formData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "فشل الانضمام للمسابقة");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { joinCompetition, loading, error };
};

export default useJoinCompetition;
