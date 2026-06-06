import React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiFetch } from "../utils/apiFetch";

const AUTH_STORAGE_KEY = "healthmax_user";

const normalizeUser = (user) => {
  if (!user) return user;

  return {
    ...user,
    id: user.id ?? user.user_id,
    cliniqueId: user.cliniqueId ?? user.clinique_id ?? null,
    nomClinique: user.nomClinique ?? user.nom_clinique ?? "",
  };
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? normalizeUser(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
};

const storeUser = (user) => {
  if (!user) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

const AuthContext = createContext(null);

export function AuthProvider({ children, onLogout }) {
  const [user, setUser] = useState(() => getStoredUser() ?? undefined);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await apiFetch("/api/auth/sec/me");

        if (!data?.authenticated || !data?.user) {
          setUser(null);
          storeUser(null);
          return;
        }

        const serverUser = normalizeUser(data.user);
        const storedUser = getStoredUser();
        const mergedUser =
          storedUser &&
          storedUser.id === serverUser.id &&
          storedUser.role === serverUser.role
            ? normalizeUser({ ...storedUser, ...serverUser })
            : serverUser;

        setUser(mergedUser);
        storeUser(mergedUser);
      } catch {
        setUser(null);
        storeUser(null);
      }
    };

    fetchMe();
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.warn("Logout request failed:", err);
    } finally {
      setUser(null);
      storeUser(null);
      localStorage.clear();
      sessionStorage.clear();
      onLogout?.();
    }
  }, [onLogout]);

  const setUserFromLogin = useCallback((responseUser) => {
    const normalizedUser = normalizeUser(responseUser);
    setUser(normalizedUser);
    storeUser(normalizedUser);
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
