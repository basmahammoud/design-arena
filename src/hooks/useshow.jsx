// hooks/useShow.jsx
import { useState, useEffect } from "react";
import { show } from "../services/competitionserv";

const useShow = (id) => {
  const [competition, setCompetition] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const getCompetition = async () => {
      try {
        const data = await show(id);
        setCompetition(data.competition); 
        setDesigns(data.designs || []);   
      } catch (err) {
        console.error("Error fetching competition:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    getCompetition();
  }, [id]);

  return { competition, designs, loading, error };
};

export default useShow;
