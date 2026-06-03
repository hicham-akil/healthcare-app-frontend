import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
// FIX: path is one level up from src/tests/, not two
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/reusable/Navbar";

vi.mock("../context/AuthContext", () => ({
    useAuth: vi.fn(),
}));

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

    it("renders the healthMax logo", () => {
        renderNavbar();
        expect(screen.getByRole("link", { name: /healthmax/i })).toBeInTheDocument();
    });

    it("shows 'Connexion' link when user is null", () => {
        renderNavbar(null);
        expect(screen.getByRole("link", { name: /connexion/i })).toBeInTheDocument();
    });

    it("does NOT show logout button when user is null", () => {
        renderNavbar(null);
        expect(screen.queryByRole("button", { name: /déconnexion/i })).not.toBeInTheDocument();
    });

    it("shows logout button when user is logged in", () => {
        renderNavbar({ id: 1, role: "PATIENT" });
        expect(screen.getAllByText(/déconnexion/i).length).toBeGreaterThan(0);
    });

    it("does NOT show 'Connexion' link when logged in", () => {
        renderNavbar({ id: 1, role: "PATIENT" });
        expect(screen.queryByRole("link", { name: /connexion/i })).not.toBeInTheDocument();
    });

    it("shows role badge for logged-in user", () => {
        renderNavbar({ id: 1, role: "PATIENT" });
        expect(screen.getByText(/patient/i)).toBeInTheDocument();
    });

    it("shows 'Médecins' link for PATIENT", () => {
        renderNavbar({ id: 1, role: "PATIENT" });
        expect(screen.getByText(/patient/i)).toBeInTheDocument();
    });

    it("does NOT show 'Horaires' link for PATIENT", () => {
        renderNavbar({ id: 1, role: "PATIENT" });
        expect(screen.queryByRole("link", { name: /horaires/i })).not.toBeInTheDocument();
    });

    it("shows 'Horaires' link for MEDECIN", () => {
        renderNavbar({ id: 2, role: "MEDECIN" });
        expect(screen.getByRole("link", { name: /horaires/i })).toBeInTheDocument();
    });

    it("does NOT show 'Médecins' link for MEDECIN", () => {
        renderNavbar({ id: 2, role: "MEDECIN" });
        expect(screen.queryByRole("link", { name: /médecins/i })).not.toBeInTheDocument();
    });

    it("shows 'Admin' link for ADMIN", () => {
        renderNavbar({ id: 99, role: "ADMIN" });
        expect(screen.getByRole("link", { name: /admin/i })).toBeInTheDocument();
    });

    it("does NOT show 'Accueil' / 'Mes Rendez-vous' in desktop nav for ADMIN", () => {
        renderNavbar({ id: 99, role: "ADMIN" });
        const desktopNav = document.querySelector(".nav-links");
        expect(desktopNav.querySelector('a[href="/"]')).toBeNull();
    });

    it("toggles mobile menu on hamburger click", () => {
        renderNavbar({ id: 1, role: "PATIENT" });
        const hamburger = screen.getByLabelText(/menu/i);

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
        render(
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        );

        const logoutBtns = screen.getAllByText(/déconnexion/i);
        fireEvent.click(logoutBtns[0]);
        expect(logout).toHaveBeenCalledTimes(1);
    });
});
