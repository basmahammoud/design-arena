import { useEffect, useState } from 'react';
import { getDesignSearch } from '../services/search-serv';

const useDesignSearch = (query) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    getDesignSearch(query).then(setResults);
  }, [query]);

  return results;
};

export default useDesignSearch;
