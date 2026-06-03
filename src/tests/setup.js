import "@testing-library/jest-dom";
import { vi, beforeAll, afterAll, afterEach } from "vitest"; // add this line

const originalConsoleError = console.error;
beforeAll(() => {
    console.error = (...args) => {
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

afterEach(() => {
    vi.clearAllMocks();
});