import { useEffect, useState } from "react";
import { getsearch } from "../services/search-serv";

const useSearch = (query) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const data = await getsearch(query);
                setResults(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    return { results, loading, error };
};

export default useSearch;
