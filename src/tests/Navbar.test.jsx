import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/reusable/Navbar";
import { useAuth } from "../context/AuthContext";

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

  it("shows Connexion link when user is null", () => {
    renderNavbar(null);
    expect(screen.getByRole("link", { name: /connexion/i })).toBeInTheDocument();
  });

  it("does not show logout button when user is null", () => {
    renderNavbar(null);
    expect(screen.queryByRole("button", { name: /logout/i })).not.toBeInTheDocument();
  });

  it("shows logout button when user is logged in", () => {
    renderNavbar({ id: 1, role: "PATIENT" });
    expect(screen.getAllByText(/logout/i).length).toBeGreaterThan(0);
  });

  it("shows Medecins link for PATIENT", () => {
    renderNavbar({ id: 1, role: "PATIENT" });
    expect(screen.getByRole("link", { name: /medecins/i })).toBeInTheDocument();
  });

  it("shows Horaires link for MEDECIN", () => {
    renderNavbar({ id: 2, role: "MEDECIN" });
    expect(screen.getByRole("link", { name: /horaires/i })).toBeInTheDocument();
  });

  it("shows Admin link for ADMIN", () => {
    renderNavbar({ id: 99, role: "ADMIN" });
    expect(screen.getByRole("link", { name: /admin/i })).toBeInTheDocument();
  });

  it("shows Clinique link for CLINIQUE", () => {
    renderNavbar({ id: 7, role: "CLINIQUE", cliniqueId: 7 });
    expect(screen.getByRole("link", { name: /clinique/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /mes rendez-vous/i })).not.toBeInTheDocument();
  });

  it("shows Clinique link for CLINIQUE_ADMIN", () => {
    renderNavbar({ id: 8, role: "CLINIQUE_ADMIN", cliniqueId: 7 });
    expect(screen.getByRole("link", { name: /clinique/i })).toBeInTheDocument();
  });

  it("keeps profile link for authenticated clinic roles", () => {
    renderNavbar({ id: 7, role: "CLINIQUE", cliniqueId: 7 });
    expect(screen.getByRole("link", { name: /profil/i })).toBeInTheDocument();
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

    fireEvent.click(screen.getAllByText(/logout/i)[0]);
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
