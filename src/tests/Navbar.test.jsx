import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

vi.mock("../../context/AuthContext", () => ({
    useAuth: vi.fn(),
}));

import { useAuth } from "../../context/AuthContext";

function renderNavbar(user = null) {
    useAuth.mockReturnValue({ user, logout: vi.fn() });
    return render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );
}

describe("Navbar", () => {
    beforeEach(() => vi.clearAllMocks());

    // ── Brand ──────────────────────────────────────────────
    it("renders the healthMax logo", () => {
        renderNavbar();
        expect(screen.getAllByText(/healthMax/i).length).toBeGreaterThan(0);
    });

    // ── Guest (not logged in) ──────────────────────────────
    it("shows 'Connexion' link when user is null", () => {
        renderNavbar(null);
        expect(screen.getByRole("link", { name: /connexion/i })).toBeInTheDocument();
    });

    it("does NOT show logout button when user is null", () => {
        renderNavbar(null);
        expect(screen.queryByRole("button", { name: /déconnexion/i })).not.toBeInTheDocument();
    });

    // ── Logged-in (any role) ───────────────────────────────
    it("shows logout button when user is logged in", () => {
        renderNavbar({ id: 1, role: "PATIENT" });
        // There are two (desktop + mobile), just confirm at least one
        expect(screen.getAllByText(/déconnexion/i).length).toBeGreaterThan(0);
    });

    it("does NOT show 'Connexion' link when logged in", () => {
        renderNavbar({ id: 1, role: "PATIENT" });
        expect(screen.queryByRole("link", { name: /connexion/i })).not.toBeInTheDocument();
    });

    it("shows role badge for logged-in user", () => {
        renderNavbar({ id: 1, role: "PATIENT" });
        expect(screen.getByText("PATIENT")).toBeInTheDocument();
    });

    // ── PATIENT links ──────────────────────────────────────
    it("shows 'Médecins' link for PATIENT", () => {
        renderNavbar({ id: 1, role: "PATIENT" });
        expect(screen.getByRole("link", { name: /médecins/i })).toBeInTheDocument();
    });

    it("does NOT show 'Horaires' link for PATIENT", () => {
        renderNavbar({ id: 1, role: "PATIENT" });
        expect(screen.queryByRole("link", { name: /horaires/i })).not.toBeInTheDocument();
    });

    // ── MEDECIN links ──────────────────────────────────────
    it("shows 'Horaires' link for MEDECIN", () => {
        renderNavbar({ id: 2, role: "MEDECIN" });
        expect(screen.getByRole("link", { name: /horaires/i })).toBeInTheDocument();
    });

    it("does NOT show 'Médecins' link for MEDECIN", () => {
        renderNavbar({ id: 2, role: "MEDECIN" });
        expect(screen.queryByRole("link", { name: /médecins/i })).not.toBeInTheDocument();
    });

    // ── ADMIN links ────────────────────────────────────────
    it("shows 'Admin' link for ADMIN", () => {
        renderNavbar({ id: 99, role: "ADMIN" });
        expect(screen.getByRole("link", { name: /admin/i })).toBeInTheDocument();
    });

    it("does NOT show 'Accueil' / 'Mes Rendez-vous' in desktop nav for ADMIN", () => {
        renderNavbar({ id: 99, role: "ADMIN" });
        const desktopLinks = screen.queryAllByRole("link", { name: /accueil/i });
        // Desktop nav hides these for ADMIN; mobile still has them
        // We check the desktop nav list specifically
        const desktopNav = document.querySelector(".nav-links");
        expect(desktopNav.querySelector('a[href="/"]')).toBeNull();
    });

    // ── Mobile hamburger ───────────────────────────────────
    it("toggles mobile menu on hamburger click", () => {
        renderNavbar({ id: 1, role: "PATIENT" });
        const hamburger = screen.getByRole("button", { name: /menu/i });

        // Initially closed
        const mobileMenu = document.querySelector(".nav-mobile");
        expect(mobileMenu.classList.contains("open")).toBe(false);

        fireEvent.click(hamburger);
        expect(mobileMenu.classList.contains("open")).toBe(true);

        fireEvent.click(hamburger);
        expect(mobileMenu.classList.contains("open")).toBe(false);
    });

    it("calls logout when logout button is clicked", () => {
        const logout = vi.fn();
        useAuth.mockReturnValue({ user: { id: 1, role: "PATIENT" }, logout });
        render(<MemoryRouter><Navbar /></MemoryRouter>);

        // Click desktop logout
        const logoutBtns = screen.getAllByText(/déconnexion/i);
        fireEvent.click(logoutBtns[0]);
        expect(logout).toHaveBeenCalledTimes(1);
    });
});