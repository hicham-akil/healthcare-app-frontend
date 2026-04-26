import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch, ApiError } from "../utils/apiFetch";

export function useFetch(url, options = {}) {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(!!url);
    const [error, setError] = useState(null);

    const optionsRef = useRef(options);
    optionsRef.current = options;

    const fetchData = useCallback(async () => {
        if (!url) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await apiFetch(url, optionsRef.current);
            setData(result);
        } catch (err) {
           
            setError(err instanceof ApiError ? err.message : "Erreur inattendue");
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

export function useAction() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (url, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const result = await apiFetch(url, options);
            return result;
        } catch (err) {
            const message = err instanceof ApiError ? err.message : "Erreur inattendue";
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => setError(null), []);

    return { execute, loading, error, reset };
}