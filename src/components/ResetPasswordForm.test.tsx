import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResetPasswordForm from './ResetPasswordForm';
import useResetPassword from '../hooks/useResetPassword';

vi.mock('../hooks/useResetPassword');

describe('ResetPasswordForm', () => {
  const mockResetPassword = vi.fn();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    (useResetPassword as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockResetPassword,
      isPending: false,
      isError: false,
      error: null,
    });

    // Simuler un reset_token dans l'URL
    window.history.pushState({}, '', '/reset-password?reset_token=mock-token');

    render(
      <MemoryRouter>
        <ResetPasswordForm />
      </MemoryRouter>
    );
  });

  it('displays the reset password form', () => {
    expect(screen.getByPlaceholderText('Password here')).toBeTruthy();
    expect(screen.getByPlaceholderText('Confirm Password here')).toBeTruthy();
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
    expect(mockResetPassword).not.toHaveBeenCalled();
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
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it('submits form with the right data', async () => {
    fireEvent.change(screen.getByPlaceholderText('Password here'), {
      target: { value: 'password123' },
    });

    fireEvent.change(screen.getByPlaceholderText('Confirm Password here'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() =>
      expect(mockResetPassword).toHaveBeenCalledWith({
        user: {
          reset_password_token: 'mock-token',
          password: 'password123',
          password_confirmation: 'password123',
        },
      })
    );
  });

  it('throws error when reset token is missing', async () => {
    // Simule l'absence du token reset_token dans l'URL
    window.location.search = '';

    const submitButton = screen.getByRole('button');

    try {
      fireEvent.submit(submitButton);
    } catch (error) {
      expect(error).toEqual(new Error('Reset token not found'));
    }
  });

  it('displays error message on failed reset password', async () => {
    (useResetPassword as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      mutate: mockResetPassword,
      isPending: false,
      isError: true,
      error: { message: 'Reset password failed' },
    });

    fireEvent.change(screen.getByPlaceholderText('Password here'), {
      target: { value: 'password123' },
    });

    fireEvent.change(screen.getByPlaceholderText('Confirm Password here'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button'));

    const errorMessage = await screen.findByText(
      'Reset password failed: Reset password failed'
    );
    expect(errorMessage).toBeTruthy();
  });
});
