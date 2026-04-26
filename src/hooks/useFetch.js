// src/hooks/useFetch.js

import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch, ApiError } from "../utils/apiFetch";

/**
 * useFetch — hook générique pour les requêtes GET avec états loading/error/data
 *
 * Usage basique :
 *   const { data, loading, error, refetch } = useFetch("/api/rendezvous/patient/5");
 *
 * Usage conditionnel (ne fetch pas si url est null) :
 *   const { data } = useFetch(userId ? `/api/users/${userId}` : null);
 *
 * @param {string|null} url       — endpoint relatif, ou null pour désactiver
 * @param {RequestInit} options   — options fetch optionnelles
 * @returns {{ data, loading, error, refetch }}
 */
export function useFetch(url, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(!!url); // true dès le départ si url fournie
    const [error, setError] = useState(null);

    // Sérialiser les options pour éviter des re-renders infinis
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

/**
 * useAction — hook pour les mutations (POST, PUT, DELETE)
 * Pas de fetch automatique, déclenché manuellement via execute()
 *
 * Usage :
 *   const { execute, loading, error } = useAction();
 *
 *   const handleSubmit = async () => {
 *     const result = await execute("/api/rendezvous", { method: "POST", body: payload });
 *     if (result) navigate("/myapoin");
 *   };
 *
 * @returns {{ execute, loading, error, reset }}
 */
export function useAction() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (url, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const result = await apiFetch(url, options);
            return result; // le composant récupère le résultat directement
        } catch (err) {
            const message = err instanceof ApiError ? err.message : "Erreur inattendue";
            setError(message);
            return null; // signale l'échec sans throw
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => setError(null), []);

    return { execute, loading, error, reset };
}