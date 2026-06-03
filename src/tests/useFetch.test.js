import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useFetch, useAction } from "../hooks/useFetch";
import { ApiError } from "../utils/apiFetch";

// ── Mock apiFetch ──────────────────────────────────────────
vi.mock("../utils/apiFetch", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        apiFetch: vi.fn(),
    };
});

import { apiFetch } from "../utils/apiFetch";

// ── useFetch ───────────────────────────────────────────────
describe("useFetch", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("starts with loading=true and data=undefined when url is provided", () => {
        apiFetch.mockResolvedValueOnce({ id: 1 });
        const { result } = renderHook(() => useFetch("/api/items"));
        expect(result.current.loading).toBe(true);
        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toBeNull();
    });

    it("sets data and loading=false on success", async () => {
        apiFetch.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
        const { result } = renderHook(() => useFetch("/api/items"));

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.data).toEqual([{ id: 1 }, { id: 2 }]);
        expect(result.current.error).toBeNull();
    });

    it("sets error and loading=false on ApiError", async () => {
        apiFetch.mockRejectedValueOnce(new ApiError("Ressource introuvable.", 404));
        const { result } = renderHook(() => useFetch("/api/missing"));

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBe("Ressource introuvable.");
        expect(result.current.data).toBeUndefined();
    });

    it("sets generic error message on unknown error", async () => {
        apiFetch.mockRejectedValueOnce(new Error("Something broke"));
        const { result } = renderHook(() => useFetch("/api/broken"));

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBe("Erreur inattendue");
    });

    it("does NOT fetch when url is null — loading=false immediately", () => {
        const { result } = renderHook(() => useFetch(null));
        expect(result.current.loading).toBe(false);
        expect(apiFetch).not.toHaveBeenCalled();
    });

    it("does NOT fetch when url is empty string", () => {
        const { result } = renderHook(() => useFetch(""));
        expect(result.current.loading).toBe(false);
        expect(apiFetch).not.toHaveBeenCalled();
    });

    it("re-fetches when url changes", async () => {
        apiFetch
            .mockResolvedValueOnce({ user: "Alice" })
            .mockResolvedValueOnce({ user: "Bob" });

        const { result, rerender } = renderHook(({ url }) => useFetch(url), {
            initialProps: { url: "/api/users/1" },
        });

        await waitFor(() => expect(result.current.data).toEqual({ user: "Alice" }));

        rerender({ url: "/api/users/2" });
        await waitFor(() => expect(result.current.data).toEqual({ user: "Bob" }));
        expect(apiFetch).toHaveBeenCalledTimes(2);
    });

    it("refetch() triggers a new API call", async () => {
        apiFetch
            .mockResolvedValueOnce({ count: 1 })
            .mockResolvedValueOnce({ count: 2 });

        const { result } = renderHook(() => useFetch("/api/stats"));
        await waitFor(() => expect(result.current.data).toEqual({ count: 1 }));

        act(() => { result.current.refetch(); });
        await waitFor(() => expect(result.current.data).toEqual({ count: 2 }));
        expect(apiFetch).toHaveBeenCalledTimes(2);
    });

    it("calls apiFetch with the correct URL", async () => {
        apiFetch.mockResolvedValueOnce({});
        renderHook(() => useFetch("/api/rendezvous/patient/42"));
        await waitFor(() => expect(apiFetch).toHaveBeenCalledWith(
            "/api/rendezvous/patient/42",
            expect.any(Object)
        ));
    });
});

// ── useAction ─────────────────────────────────────────────
describe("useAction", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("initial state: loading=false, error=null", () => {
        const { result } = renderHook(() => useAction());
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it("sets loading=true during execute and false after", async () => {
        let resolve;
        apiFetch.mockReturnValueOnce(new Promise((r) => { resolve = r; }));

        const { result } = renderHook(() => useAction());

        act(() => { result.current.execute("/api/action", { method: "POST" }); });
        expect(result.current.loading).toBe(true);

        await act(async () => { resolve({ ok: true }); });
        expect(result.current.loading).toBe(false);
    });

    it("returns the result on success", async () => {
        apiFetch.mockResolvedValueOnce({ queueNumber: 7 });
        const { result } = renderHook(() => useAction());

        let returnValue;
        await act(async () => {
            returnValue = await result.current.execute("/api/rendezvous", { method: "POST" });
        });

        expect(returnValue).toEqual({ queueNumber: 7 });
        expect(result.current.error).toBeNull();
    });

    it("sets error and returns null on ApiError", async () => {
        apiFetch.mockRejectedValueOnce(new ApiError("Accès refusé.", 403));
        const { result } = renderHook(() => useAction());

        let returnValue;
        await act(async () => {
            returnValue = await result.current.execute("/api/admin", { method: "DELETE" });
        });

        expect(returnValue).toBeNull();
        expect(result.current.error).toBe("Accès refusé.");
    });

    it("sets generic error on unknown exception", async () => {
        apiFetch.mockRejectedValueOnce(new Error("network issue"));
        const { result } = renderHook(() => useAction());

        await act(async () => { await result.current.execute("/api/test"); });
        expect(result.current.error).toBe("Erreur inattendue");
    });

    it("reset() clears error", async () => {
        apiFetch.mockRejectedValueOnce(new ApiError("Not found", 404));
        const { result } = renderHook(() => useAction());

        await act(async () => { await result.current.execute("/api/x"); });
        expect(result.current.error).toBeTruthy();

        act(() => { result.current.reset(); });
        expect(result.current.error).toBeNull();
    });

    it("clears previous error before a new execute", async () => {
        apiFetch
            .mockRejectedValueOnce(new ApiError("First error", 500))
            .mockResolvedValueOnce({ success: true });

        const { result } = renderHook(() => useAction());

        await act(async () => { await result.current.execute("/api/x"); });
        expect(result.current.error).toBeTruthy();

        await act(async () => { await result.current.execute("/api/x"); });
        expect(result.current.error).toBeNull();
    });
});