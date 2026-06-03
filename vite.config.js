import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.js"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: [
        "src/utils/apiFetch.js",
        "src/hooks/useFetch.js",
        "src/context/AuthContext.jsx",
        "src/components/Security/ProtectedRoute.jsx",
        "src/components/reusable/Navbar.jsx",
        "src/Pages/Notfound.jsx",
        "src/components/Auth/AuthLayout.jsx",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 65,
      },
    },
  },
});