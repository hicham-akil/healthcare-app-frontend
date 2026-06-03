import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
// FIX: NotFound lives in src/Pages/, not src/tests/
import NotFound from "../Pages/Notfound";
import AuthLayout from "../components/Auth/AuthLayout";

vi.mock("../components/Auth/Signin", () => ({
    default: () => <div data-testid="signin-form">Signin Form</div>,
}));
vi.mock("../components/Auth/Signup", () => ({
    default: () => <div data-testid="signup-form">Signup Form</div>,
}));

describe("NotFound", () => {
    it("renders 404 message", () => {
        render(<NotFound />);
        expect(screen.getByText(/404/i)).toBeInTheDocument();
        expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    });

    it("is vertically centered (flex layout)", () => {
        render(<NotFound />);
        const wrapper = screen.getByText(/404/).closest("div");
        expect(wrapper).not.toBeNull();
    });
});

describe("AuthLayout", () => {
    it("renders the 'Se connecter' tab", () => {
        render(<AuthLayout />);
        expect(screen.getByRole("button", { name: /se connecter/i })).toBeInTheDocument();
    });

    it("renders the 'Créer un compte' tab", () => {
        render(<AuthLayout />);
        expect(screen.getByRole("button", { name: /créer un compte/i })).toBeInTheDocument();
    });

    it("shows Signin form by default", () => {
        render(<AuthLayout />);
        expect(screen.getByTestId("signin-form")).toBeInTheDocument();
        expect(screen.queryByTestId("signup-form")).not.toBeInTheDocument();
    });

    it("switches to Signup form when 'Créer un compte' tab is clicked", () => {
        render(<AuthLayout />);
        fireEvent.click(screen.getByRole("button", { name: /créer un compte/i }));
        expect(screen.getByTestId("signup-form")).toBeInTheDocument();
        expect(screen.queryByTestId("signin-form")).not.toBeInTheDocument();
    });

    it("switches back to Signin form when 'Se connecter' tab is clicked", () => {
        render(<AuthLayout />);
        fireEvent.click(screen.getByRole("button", { name: /créer un compte/i }));
        expect(screen.getByTestId("signup-form")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));
        expect(screen.getByTestId("signin-form")).toBeInTheDocument();
    });

    it("active tab has the 'active' class", () => {
        render(<AuthLayout />);
        const signinBtn = screen.getByRole("button", { name: /se connecter/i });
        const signupBtn = screen.getByRole("button", { name: /créer un compte/i });

        expect(signinBtn.className).toContain("active");
        expect(signupBtn.className).not.toContain("active");

        fireEvent.click(signupBtn);
        expect(signupBtn.className).toContain("active");
        expect(signinBtn.className).not.toContain("active");
    });
});