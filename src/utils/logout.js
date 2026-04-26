import BASE_URL from "./api";

export const logout = async (navigate) => {
  try {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.clear(); 
    navigate("/auth", { replace: true });
  }
};