const ERROR_MESSAGES = {
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

/**
 * Classe d'erreur personnalisée pour les erreurs API
 */
export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data; // body JSON de la réponse si disponible
    }
}

/**
 * apiFetch — wrapper centralisé autour de fetch()
 *
 * Usage :
 *   const data = await apiFetch("/api/rendezvous");
 *   const data = await apiFetch("/api/users/1", { method: "PUT", body: JSON.stringify(payload) });
 *
 * @param {string} endpoint  — chemin relatif ex: "/api/rendezvous"
 * @param {RequestInit} options — options fetch standard
 * @returns {Promise<any>}   — body JSON parsé
 * @throws {ApiError}        — avec .status et .message lisibles
 */
export async function apiFetch(endpoint, options = {}) {
    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    // Ne pas forcer Content-Type si on envoie un FormData
    const isFormData = options.body instanceof FormData;
    const headers = isFormData
        ? options.headers || {}
        : { ...defaultHeaders, ...(options.headers || {}) };

    let response;

    try {
        response = await fetch(url, {
            credentials: "include", // toujours envoyer les cookies de session
            ...options,
            headers,
        });
    } catch (networkError) {
        // Pas de réponse du tout : coupure réseau, CORS bloqué, serveur éteint
        throw new ApiError(
            "Impossible de joindre le serveur. Vérifiez votre connexion.",
            0
        );
    }

    // Cas 401 : session expirée → redirection automatique vers /auth
    if (response.status === 401) {
        localStorage.removeItem("user_id");
        localStorage.removeItem("role");
        // On laisse le composant gérer ou on redirige directement
        window.location.href = "/auth";
        throw new ApiError(ERROR_MESSAGES[401], 401);
    }

    // Essayer de parser le body JSON (certaines réponses n'en ont pas)
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
        // Message prioritaire : celui renvoyé par le backend
        const serverMessage =
            data?.message || data?.error || data?.detail || null;

        const fallbackMessage =
            ERROR_MESSAGES[response.status] ||
            `Erreur inattendue (${response.status})`;

        throw new ApiError(serverMessage || fallbackMessage, response.status, data);
    }

    return data;
}

/**
 * Helpers sémantiques (optionnels, rendent le code plus lisible)
 */
export const api = {
    get: (endpoint, options = {}) =>
        apiFetch(endpoint, { ...options, method: "GET" }),

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

    delete: (endpoint, options = {}) =>
        apiFetch(endpoint, { ...options, method: "DELETE" }),
};