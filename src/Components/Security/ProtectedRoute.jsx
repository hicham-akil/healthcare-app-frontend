import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import BASE_URL from "../../utils/api.js";

const ProtectedRoute = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/sec/me`, {
          credentials: "include",
        });

        if (res.status === 401) {
          setAuth(false);
          return;
        }

        const data = await res.json();
        setAuth(!!data.authenticated);
      } catch (err) {
        setAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (auth === null) return <div>Chargement...</div>;
  if (!auth) return <Navigate to="/auth" replace />;
  return <Outlet />;
};

export default ProtectedRoute;