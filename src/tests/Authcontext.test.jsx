import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "../context/AuthContext";

vi.mock("../utils/apiFetch", () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from "../utils/apiFetch";

function AuthConsumer() {
  const { user, logout, setUserFromLogin } = useAuth();

  return (
    <div>
      <span data-testid="user">
        {user === undefined ? "loading" : user === null ? "null" : JSON.stringify(user)}
      </span>
      <button onClick={logout}>logout</button>
      <button
        onClick={() =>
          setUserFromLogin({
            id: 7,
            role: "CLINIQUE",
            cliniqueId: 7,
            nomClinique: "Clinique Atlas",
          })
        }
      >
        login
      </button>
    </div>
  );
}

function renderWithAuth(onLogout = vi.fn()) {
  return render(
    <AuthProvider onLogout={onLogout}>
      <AuthConsumer />
    </AuthProvider>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it("starts with loading when no stored user exists", () => {
    apiFetch.mockReturnValueOnce(new Promise(() => {}));
    renderWithAuth();
    expect(screen.getByTestId("user").textContent).toBe("loading");
  });

  it("sets user from /api/auth/sec/me on mount", async () => {
    apiFetch.mockResolvedValueOnce({
      authenticated: true,
      user: { id: 42, role: "PATIENT", email: "alice@test.com" },
    });

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toContain('"id":42');
    });
  });

  it("normalizes user_id to id", async () => {
    apiFetch.mockResolvedValueOnce({
      authenticated: true,
      user: { user_id: 99, role: "MEDECIN" },
    });

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toContain('"id":99');
    });
  });

  it("keeps stored clinic metadata when /me returns the same user", async () => {
    localStorage.setItem(
      "healthmax_user",
      JSON.stringify({
        id: 7,
        role: "CLINIQUE",
        cliniqueId: 7,
        nomClinique: "Clinique Atlas",
      })
    );

    apiFetch.mockResolvedValueOnce({
      authenticated: true,
      user: { user_id: 7, role: "CLINIQUE" },
    });

    renderWithAuth();

    await waitFor(() => {
      const text = screen.getByTestId("user").textContent;
      expect(text).toContain('"cliniqueId":7');
      expect(text).toContain('"nomClinique":"Clinique Atlas"');
    });
  });

  it("sets user to null when not authenticated", async () => {
    apiFetch.mockResolvedValueOnce({ authenticated: false });
    renderWithAuth();
    await waitFor(() => expect(screen.getByTestId("user").textContent).toBe("null"));
  });

  it("sets user to null when /me throws", async () => {
    apiFetch.mockRejectedValueOnce(new Error("Network error"));
    renderWithAuth();
    await waitFor(() => expect(screen.getByTestId("user").textContent).toBe("null"));
  });

  it("setUserFromLogin persists clinic users to localStorage", async () => {
    apiFetch.mockResolvedValueOnce({ authenticated: false });
    renderWithAuth();

    await waitFor(() => expect(screen.getByTestId("user").textContent).toBe("null"));

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /login/i }));
    });

    expect(screen.getByTestId("user").textContent).toContain('"nomClinique":"Clinique Atlas"');
    expect(JSON.parse(localStorage.getItem("healthmax_user"))).toMatchObject({
      id: 7,
      role: "CLINIQUE",
      cliniqueId: 7,
      nomClinique: "Clinique Atlas",
    });
  });

  it("logout calls /api/auth/logout and clears storage", async () => {
    apiFetch
      .mockResolvedValueOnce({
        authenticated: true,
        user: { id: 1, role: "PATIENT" },
      })
      .mockResolvedValueOnce({});

    localStorage.setItem("token", "abc");
    sessionStorage.setItem("session", "xyz");

    const onLogout = vi.fn();
    renderWithAuth(onLogout);

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toContain('"id":1');
    });

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /logout/i }));
    });

    expect(apiFetch).toHaveBeenCalledWith("/api/auth/logout", { method: "POST" });
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(localStorage.getItem("token")).toBeNull();
    expect(sessionStorage.getItem("session")).toBeNull();
    expect(localStorage.getItem("healthmax_user")).toBeNull();
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("throws if useAuth is used outside AuthProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<AuthConsumer />)).toThrow("useAuth must be used inside <AuthProvider>");
    spy.mockRestore();
  });
});
