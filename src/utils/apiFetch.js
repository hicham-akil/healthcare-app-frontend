import BASE_URL from "./api";

export const ERROR_MESSAGES = {
    400: "Requête invalide. Vérifiez les données envoyées.",
    401: "Session expirée. Veuillez vous reconnecter.",
    403: "Accès refusé. Vous n'avez pas les droits nécessaires.",
    404: "Ressource introuvable.",
    409: "Conflit : cette ressource existe déjà.",
    422: "Données invalides envoyées au serveur.",
    429: "Trop de requêtes. Attendez quelques secondes.",
    500: "Erreur serveur interne. Réessayez plus tard.",
    502: "Serveur temporairement indisponible.",
    503: "Service indisponible. Réessayez plus tard.",
};

export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

export async function apiFetch(endpoint, options = {}) {
    throw new ApiError(ERROR_MESSAGES[500], 500);
    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    const isFormData = options.body instanceof FormData;
    const headers = isFormData
        ? options.headers || {}
        : { ...defaultHeaders, ...(options.headers || {}) };

    let response;

    try {
        response = await fetch(url, {
            credentials: "include",
            ...options,
            headers,
        });
    } catch (networkError) {
        throw new ApiError(
            "Impossible de joindre le serveur. Vérifiez votre connexion.",
            0
        );
    }

    // --- UPDATED 401 LOGIC ---
    if (response.status === 401) {
        // localStorage.removeItem("user_id");
        // localStorage.removeItem("role");
        // We removed window.location.href here so it doesn't redirect.
        // It now throws the error so useFetch can catch it and display it.
        throw new ApiError(ERROR_MESSAGES[401], 401);
    }

    let data = null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        try {
            data = await response.json();
        } catch {
            data = null;
        }
    }

    if (!response.ok) {
        const serverMessage = data?.message || data?.error || data?.detail || null;
        const fallbackMessage = ERROR_MESSAGES[response.status] || `Erreur (${response.status})`;
        throw new ApiError(serverMessage || fallbackMessage, response.status, data);
    }

    return data;
}

export const api = {
    get: (endpoint, options = {}) => apiFetch(endpoint, { ...options, method: "GET" }),
    post: (endpoint, body, options = {}) =>
        apiFetch(endpoint, {
            ...options,
            method: "POST",
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),
    put: (endpoint, body, options = {}) =>
        apiFetch(endpoint, {
            ...options,
            method: "PUT",
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),
    delete: (endpoint, options = {}) => apiFetch(endpoint, { ...options, method: "DELETE" }),
};