import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch, ApiError, ERROR_MESSAGES } from "../utils/apiFetch";
vi.mock("./api", () => ({ default: "http://localhost:8080" }));

describe("apiFetch", () => {
    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    // ── Success cases ──────────────────────────────────────────
    it("returns parsed JSON on 200", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: { get: () => "application/json" },
            json: async () => ({ id: 1, name: "Alice" }),
        });

        const result = await apiFetch("/api/users/1");
        expect(result).toEqual({ id: 1, name: "Alice" });
    });

    it("prepends BASE_URL for relative paths", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: { get: () => "application/json" },
            json: async () => ({}),
        });

        await apiFetch("/api/test");
        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:8080/api/test",
            expect.any(Object)
        );
    });

    it("uses absolute URL as-is", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: { get: () => "application/json" },
            json: async () => ({}),
        });

        await apiFetch("https://other.api/data");
        expect(fetch).toHaveBeenCalledWith(
            "https://other.api/data",
            expect.any(Object)
        );
    });

    it("sends credentials: include by default", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: { get: () => "application/json" },
            json: async () => ({}),
        });

        await apiFetch("/api/me");
        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({ credentials: "include" })
        );
    });

    it("sets Content-Type: application/json for plain objects", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: { get: () => "application/json" },
            json: async () => ({}),
        });

        await apiFetch("/api/login", { method: "POST", body: { email: "a@b.com" } });
        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({ "Content-Type": "application/json" }),
            })
        );
    });

    it("does NOT set Content-Type for FormData", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: { get: () => "application/json" },
            json: async () => ({}),
        });

        const fd = new FormData();
        fd.append("key", "val");
        await apiFetch("/api/upload", { method: "POST", body: fd });

        const [, options] = fetch.mock.calls[0];
        expect(options.headers["Content-Type"]).toBeUndefined();
    });

    it("stringifies object body", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: { get: () => "application/json" },
            json: async () => ({}),
        });

        await apiFetch("/api/data", { method: "POST", body: { foo: "bar" } });
        const [, options] = fetch.mock.calls[0];
        expect(options.body).toBe(JSON.stringify({ foo: "bar" }));
    });

    it("returns null when response has no JSON content-type", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 204,
            headers: { get: () => "" },
        });

        const result = await apiFetch("/api/delete");
        expect(result).toBeNull();
    });

    // ── Error cases ────────────────────────────────────────────
    it("throws ApiError with 401 message on 401", async () => {
        // FIX: two awaited assertions each consume one mock response — queue two
        const make401 = () => ({
            ok: false,
            status: 401,
            headers: { get: () => "application/json" },
            json: async () => ({}),
        });
        fetch.mockResolvedValueOnce(make401()).mockResolvedValueOnce(make401());

        await expect(apiFetch("/api/secure")).rejects.toThrow(ApiError);
        await expect(apiFetch("/api/secure")).rejects.toMatchObject({
            status: 401,
            message: ERROR_MESSAGES[401],
        });
    });

    it("throws ApiError on 404 with fallback message", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            headers: { get: () => "application/json" },
            json: async () => ({}),
        });

        await expect(apiFetch("/api/missing")).rejects.toMatchObject({
            status: 404,
            message: ERROR_MESSAGES[404],
        });
    });

    it("prefers server message over generic fallback", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            headers: { get: () => "application/json" },
            json: async () => ({ message: "Email already used" }),
        });

        await expect(apiFetch("/api/register", { method: "POST", body: {} }))
            .rejects.toMatchObject({ message: "Email already used" });
    });

    it("throws ApiError with status 0 on network failure", async () => {
        fetch.mockRejectedValueOnce(new TypeError("Network Error"));

        await expect(apiFetch("/api/test")).rejects.toMatchObject({ status: 0 });
    });

    it("re-throws ApiError without wrapping", async () => {
        const originalError = new ApiError("Custom", 422);
        fetch.mockRejectedValueOnce(originalError);

        await expect(apiFetch("/api/test")).rejects.toThrow(originalError);
    });
});

describe("ApiError", () => {
    it("has correct name, message, status, and data", () => {
        const err = new ApiError("Oops", 500, { detail: "x" });
        expect(err.name).toBe("ApiError");
        expect(err.message).toBe("Oops");
        expect(err.status).toBe(500);
        expect(err.data).toEqual({ detail: "x" });
        expect(err instanceof Error).toBe(true);
        expect(err instanceof ApiError).toBe(true);
    });
});