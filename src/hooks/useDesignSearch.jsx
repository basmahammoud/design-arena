import { useEffect, useState } from 'react';
import { getDesignSearch } from '../services/search-serv';

const useDesignSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError(null);

    getDesignSearch(query)
      .then((data) => setResults(data.data || [])) 
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [query]);

  return { results, loading, error };
};

export default useDesignSearch;
