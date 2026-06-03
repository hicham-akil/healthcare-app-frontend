import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// ── Mock useAuth ───────────────────────────────────────────
vi.mock("../../context/AuthContext", () => ({
    useAuth: vi.fn(),
}));

import { useAuth } from "../../context/AuthContext";

// ── Helpers ────────────────────────────────────────────────
function renderRoute({ user, allowedRoles } = {}) {
    useAuth.mockReturnValue({ user });

    return render(
        <MemoryRouter initialEntries={["/protected"]}>
            <Routes>
                <Route path="/auth" element={<div>Login Page</div>} />
                <Route path="/" element={<div>Home Page</div>} />
                <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
                    <Route path="/protected" element={<div>Protected Content</div>} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
}

describe("ProtectedRoute", () => {
    it("shows loading when user is undefined", () => {
        renderRoute({ user: undefined });
        expect(screen.getByText("Chargement...")).toBeInTheDocument();
    });

    it("redirects to /auth when user is null (not logged in)", () => {
        renderRoute({ user: null });
        expect(screen.getByText("Login Page")).toBeInTheDocument();
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    it("renders children when user is logged in and no role restriction", () => {
        renderRoute({ user: { id: 1, role: "PATIENT" } });
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("renders children when user has an allowed role", () => {
        renderRoute({
            user: { id: 1, role: "PATIENT" },
            allowedRoles: ["PATIENT"],
        });
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("redirects to / when user role is not in allowedRoles", () => {
        renderRoute({
            user: { id: 1, role: "PATIENT" },
            allowedRoles: ["MEDECIN"],
        });
        expect(screen.getByText("Home Page")).toBeInTheDocument();
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    it("redirects to / for PATIENT trying to access ADMIN route", () => {
        renderRoute({
            user: { id: 1, role: "PATIENT" },
            allowedRoles: ["ADMIN"],
        });
        expect(screen.getByText("Home Page")).toBeInTheDocument();
    });

    it("renders children for MEDECIN with allowedRoles=['MEDECIN']", () => {
        renderRoute({
            user: { id: 5, role: "MEDECIN" },
            allowedRoles: ["MEDECIN"],
        });
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("renders children for ADMIN with allowedRoles=['ADMIN']", () => {
        renderRoute({
            user: { id: 99, role: "ADMIN" },
            allowedRoles: ["ADMIN"],
        });
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("allows multiple roles in allowedRoles", () => {
        renderRoute({
            user: { id: 2, role: "MEDECIN" },
            allowedRoles: ["MEDECIN", "ADMIN"],
        });
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });
});