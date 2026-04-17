// utils/logout.js
import BASE_URL from "./api";

/**
 * Proper logout for session-based auth
 */
export const logout = async (navigate) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include", // MUST match login
    });

    // Optional: check response
    if (!response.ok) {
      console.warn("Logout API failed, forcing client logout");
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");

    navigate("/login", { replace: true });
  }
};