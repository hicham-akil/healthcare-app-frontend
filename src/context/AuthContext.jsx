import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch } from "../utils/apiFetch";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);  // { username, role, user_id }
    const [loading, setLoading] = useState(true);

    const fetchMe = useCallback(async () => {
        try {
            const data = await apiFetch("/api/auth/sec/me");
            if (data?.authenticated && data?.user) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchMe(); }, [fetchMe]);

    const logout = useCallback(async () => {
        try {
            await apiFetch("/api/auth/logout", { method: "POST" });
        } finally {
            setUser(null);
            localStorage.clear();
            window.location.href = "/auth";
        }
    }, []);

    const setUserFromLogin = useCallback((loginResponse) => {
        setUser({
            username: loginResponse.nom,
            role: loginResponse.role,
            user_id: loginResponse.id,
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, logout, fetchMe, setUserFromLogin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}