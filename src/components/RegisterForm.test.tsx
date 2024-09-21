import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import useRegister from '../hooks/useRegister';
import { AuthContext } from '../contexts/AuthContext';

vi.mock('../hooks/useRegister');

describe('RegisterForm', () => {
  const mockRegisterUser = vi.fn();
  const mockIsAuthenticated = false;

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    (useRegister as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockRegisterUser,
      isPending: false,
      isError: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            token: null,
            login: vi.fn(),
            logout: vi.fn(),
            isAuthenticated: mockIsAuthenticated,
          }}
        >
          <RegisterForm />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  });

  it('displays register form', () => {
    expect(screen.getByPlaceholderText('Email here')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password here')).toBeTruthy();
    expect(screen.getByPlaceholderText('Confirm Password here')).toBeTruthy();
  });

  it('displays error message for invalid email', async () => {
    fireEvent.change(screen.getByPlaceholderText('Email here'), {
      target: { value: 'invalid-email' },
    });

    fireEvent.click(screen.getByRole('button'));

    const emailError = await screen.findByText('Invalid email address');
    expect(emailError).toBeTruthy();
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  it('displays error message for short password', async () => {
    fireEvent.change(screen.getByPlaceholderText('Password here'), {
      target: { value: '123' },
    });

    fireEvent.click(screen.getByRole('button'));

    const passwordError = await screen.findByText(
      'Password must be at least 6 characters long'
    );
    expect(passwordError).toBeTruthy();
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  it('displays error message for password mismatch', async () => {
    fireEvent.change(screen.getByPlaceholderText('Password here'), {
      target: { value: 'password123' },
    });

    fireEvent.change(screen.getByPlaceholderText('Confirm Password here'), {
      target: { value: 'differentpassword' },
    });

    fireEvent.click(screen.getByRole('button'));

    const mismatchError = await screen.findByText('Passwords do not match');
    expect(mismatchError).toBeTruthy();
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  it('submits form with the right data', async () => {
    fireEvent.change(screen.getByPlaceholderText('Email here'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Password here'), {
      target: { value: 'password123' },
    });

    fireEvent.change(screen.getByPlaceholderText('Confirm Password here'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() =>
      expect(mockRegisterUser).toHaveBeenCalledWith({
        user: {
          email: 'test@example.com',
          password: 'password123',
        },
      })
    );
  });

  it('displays error message on failed registration', async () => {
    (useRegister as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      mutate: mockRegisterUser,
      isPending: false,
      isError: true,
      error: { message: 'Registration failed' },
    });

    fireEvent.change(screen.getByPlaceholderText('Email here'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Password here'), {
      target: { value: 'password123' },
    });

    fireEvent.change(screen.getByPlaceholderText('Confirm Password here'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button'));

    const errorMessage = await screen.findByText(
      'Registration failed: Registration failed'
    );
    expect(errorMessage).toBeTruthy();
  });
});
