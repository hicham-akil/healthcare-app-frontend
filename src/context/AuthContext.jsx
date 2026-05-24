import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch } from "../utils/apiFetch";

const normalizeUser = (u) => ({
    ...u,
    id: u.id ?? u.user_id,
});

const AuthContext = createContext(null);

export function AuthProvider({ children, onLogout }) {
    const [user, setUser] = useState(undefined); 

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const data = await apiFetch("/api/auth/sec/me");
                setUser(data?.authenticated && data?.user
                    ? normalizeUser(data.user)
                    : null
                );
            } catch {
                setUser(null);
            }
        };

        fetchMe();
    }, []); 

    const logout = useCallback(async () => {
        try {
            await apiFetch("/api/auth/logout", { method: "POST" });
        } finally {
            setUser(null);
            localStorage.clear();
            sessionStorage.clear();
            onLogout?.();
        }
    }, [onLogout]);

    const setUserFromLogin = useCallback((res) => {
        setUser(normalizeUser(res)); 
    }, []);

    return (
        <AuthContext.Provider value={{ user, logout, setUserFromLogin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
