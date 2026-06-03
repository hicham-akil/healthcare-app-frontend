import "@testing-library/jest-dom";
import { vi } from "vitest";

// Suppress noisy console.error in tests (e.g. React prop-types, missing context)
// Remove this if you want full console output during tests
const originalConsoleError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        // Still show errors that are not React warnings
        if (
            typeof args[0] === "string" &&
            (args[0].includes("Warning:") || args[0].includes("ReactDOM.render"))
        ) {
            return;
        }
        originalConsoleError(...args);
    };
});

afterAll(() => {
    console.error = originalConsoleError;
});

// Reset all mocks between tests
afterEach(() => {
    vi.clearAllMocks();
});