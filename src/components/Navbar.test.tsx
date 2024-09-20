import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "./Navbar";

describe("Navbar", () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login and register links when not authenticated", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{ isAuthenticated: false, logout: mockLogout }}
        >
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Register")).toBeTruthy();
    expect(screen.getByText("Login")).toBeTruthy();
    expect(screen.queryByText("Logout")).toBeNull();
  });

  it("renders logout link when authenticated", () => {
    cleanup();
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{ isAuthenticated: true, logout: mockLogout }}
        >
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Logout")).toBeTruthy();
    expect(screen.queryByText("Register")).toBeNull();
    expect(screen.queryByText("Login")).toBeNull();
  });

  it("calls logout function when logout is clicked", () => {
    cleanup();
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{ isAuthenticated: true, logout: mockLogout }}
        >
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
  });
});
