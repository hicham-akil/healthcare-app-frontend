import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../context/AuthContext";

// ── Mock apiFetch ──────────────────────────────────────────
vi.mock("../utils/apiFetch", () => ({
    apiFetch: vi.fn(),
}));

import { apiFetch } from "../utils/apiFetch";

// ── Helper component that exposes context ──────────────────
function AuthConsumer() {
    const { user, logout } = useAuth();
    return (
        <div>
            <span data-testid="user">{user === undefined ? "loading" : user === null ? "null" : user.id}</span>
            <button onClick={logout}>logout</button>
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

    it("starts with user=undefined (loading state)", () => {
        apiFetch.mockReturnValueOnce(new Promise(() => { }));
        renderWithAuth();
        expect(screen.getByTestId("user").textContent).toBe("loading");
    });

    it("sets user from /api/auth/sec/me on mount", async () => {
        apiFetch.mockResolvedValueOnce({
            authenticated: true,
            user: { id: 42, role: "PATIENT", email: "alice@test.com" },
        });

        renderWithAuth();
        await waitFor(() => expect(screen.getByTestId("user").textContent).toBe("42"));
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

    it("normalizes user: maps user_id → id", async () => {
        apiFetch.mockResolvedValueOnce({
            authenticated: true,
            user: { user_id: 99, role: "MEDECIN" },
        });

        renderWithAuth();
        await waitFor(() => expect(screen.getByTestId("user").textContent).toBe("99"));
    });

    it("logout calls /api/auth/logout and sets user to null", async () => {
        apiFetch.mockResolvedValueOnce({
            authenticated: true,
            user: { id: 1, role: "PATIENT" },
        });
        apiFetch.mockResolvedValueOnce({});

        const onLogout = vi.fn();
        renderWithAuth(onLogout);
        await waitFor(() => expect(screen.getByTestId("user").textContent).toBe("1"));

        await act(async () => {
            await userEvent.click(screen.getByRole("button", { name: /logout/i }));
        });

        expect(apiFetch).toHaveBeenCalledWith("/api/auth/logout", { method: "POST" });
        expect(screen.getByTestId("user").textContent).toBe("null");
        expect(onLogout).toHaveBeenCalledTimes(1);
    });

    it("logout clears localStorage and sessionStorage", async () => {
        apiFetch
            .mockResolvedValueOnce({ authenticated: true, user: { id: 1, role: "PATIENT" } })
            .mockResolvedValueOnce({});

        localStorage.setItem("token", "abc");
        sessionStorage.setItem("session", "xyz");

        renderWithAuth();
        await waitFor(() => expect(screen.getByTestId("user").textContent).toBe("1"));

        await act(async () => {
            await userEvent.click(screen.getByRole("button", { name: /logout/i }));
        });

        expect(localStorage.getItem("token")).toBeNull();
        expect(sessionStorage.getItem("session")).toBeNull();
    });

    it("logout still clears state even if POST fails", async () => {
        apiFetch
            .mockResolvedValueOnce({ authenticated: true, user: { id: 1, role: "PATIENT" } })
            .mockRejectedValueOnce(new Error("network"));

        const onLogout = vi.fn();
        renderWithAuth(onLogout);
        await waitFor(() => expect(screen.getByTestId("user").textContent).toBe("1"));

        await act(async () => {
            await userEvent.click(screen.getByRole("button", { name: /logout/i }));
        });

        expect(screen.getByTestId("user").textContent).toBe("null");
        expect(onLogout).toHaveBeenCalled();
    });

    it("throws if useAuth is used outside AuthProvider", () => {
        const spy = vi.spyOn(console, "error").mockImplementation(() => { });
        expect(() => render(<AuthConsumer />)).toThrow(
            "useAuth must be used inside <AuthProvider>"
        );
        spy.mockRestore();
    });
});