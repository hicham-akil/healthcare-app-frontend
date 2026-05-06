import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch } from "../utils/apiFetch";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ ONLY FIX: normalize ID here
    const normalizeUser = (u) => ({
        ...u,
        id: u.id ?? u.user_id, // 🔥 FIX: unify ID
    });

    const fetchMe = useCallback(async () => {
        try {
            const data = await apiFetch("/api/auth/sec/me");

            if (data?.authenticated && data?.user) {
                setUser(normalizeUser(data.user)); // 🔥 FIX APPLIED HERE
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMe();
    }, [fetchMe]);

    const logout = useCallback(async () => {
        try {
            await apiFetch("/api/auth/logout", { method: "POST" });
        } finally {
            setUser(null);
            localStorage.clear();
            window.location.href = "/auth";
        }
    }, []);

    // ✅ KEEP login setter but FIX ID ONLY
    const setUserFromLogin = useCallback((loginResponse) => {
        setUser({
            id: loginResponse.id ?? loginResponse.user_id, // 🔥 FIX
            role: loginResponse.role,
            nom: loginResponse.nom,
            prenom: loginResponse.prenom,
            email: loginResponse.email,
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