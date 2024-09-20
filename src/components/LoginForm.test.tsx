import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "../contexts/AuthContext";
import LoginForm from "./LoginForm";
import useLogin from "../hooks/useLogin";

vi.mock("../hooks/useLogin");
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  const actualModule = actual as typeof import("react-router-dom");
  return {
    ...actualModule,
    MemoryRouter: vi.fn(({ children }) => <div>{children}</div>),
    useNavigate: vi.fn(() => vi.fn()),
  };
});

describe("LoginForm", () => {
  const mockLoginUser = vi.fn();
  const mockNavigate = vi.fn();

  beforeAll(() => {
    (useLogin as vi.Mock).mockReturnValue({
      mutate: mockLoginUser,
      isPending: false,
      isError: false,
      error: null,
    });

    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            token: null,
            login: vi.fn(),
            logout: vi.fn(),
            isAuthenticated: false,
          }}
        >
          <LoginForm />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  });

  it("displays login form", () => {
    expect(screen.getByPlaceholderText("Email here")).toBeTruthy();
    expect(screen.getByPlaceholderText("Password here")).toBeTruthy();
  });

  it("displays error messages for invalid inputs", async () => {
    fireEvent.change(screen.getByPlaceholderText("Email here"), {
      target: { value: "invalid-email" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password here"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button"));

    const emailError = await screen.findByText("Invalid email address");
    const passwordError = await screen.findByText(
      "Password must be at least 6 characters long"
    );

    expect(emailError).toBeTruthy();
    expect(passwordError).toBeTruthy();

    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it("submits form with the right data", async () => {
    fireEvent.change(screen.getByPlaceholderText("Email here"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password here"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(mockLoginUser).toHaveBeenCalledWith({
        user: {
          email: "test@example.com",
          password: "password123",
        },
      })
    );
  });

  // it("redirects after successful login", async () => {
  //   // Simuler la réussite de la mutation
  //   mockLoginUser.mockImplementationOnce(() => {
  //     return new Promise((resolve) => {
  //       resolve({ headers: { authorization: "mock-token" } });
  //     });
  //   });

  //   fireEvent.change(screen.getByPlaceholderText("Email here"), {
  //     target: { value: "test@example.com" },
  //   });
  //   fireEvent.change(screen.getByPlaceholderText("Password here"), {
  //     target: { value: "password123" },
  //   });

  //   fireEvent.click(screen.getByRole("button"));

  //   await waitFor(() => {
  //     expect(mockNavigate).toHaveBeenCalledWith("/");
  //   });
  // });
});
