import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPasswordForm from './ForgotPasswordForm';
import useForgotPassword from '../hooks/useForgotPassword';

vi.mock('../hooks/useForgotPassword');

describe('ForgotPasswordForm', () => {
  const mockForgotPassword = vi.fn();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    (useForgotPassword as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockForgotPassword,
      isPending: false,
      isError: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <ForgotPasswordForm />
      </MemoryRouter>
    );
  });

  it('displays forgot password form', () => {
    expect(screen.getByPlaceholderText('Email here')).toBeTruthy();
  });

  it('displays error message for invalid email', async () => {
    fireEvent.change(screen.getByPlaceholderText('Email here'), {
      target: { value: 'invalid-email' },
    });

    fireEvent.click(screen.getByRole('button'));

    const emailError = await screen.findByText('Invalid email address');
    expect(emailError).toBeTruthy();
    expect(mockForgotPassword).not.toHaveBeenCalled();
  });

  it('submits form with the right data', async () => {
    fireEvent.change(screen.getByPlaceholderText('Email here'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() =>
      expect(mockForgotPassword).toHaveBeenCalledWith({
        user: {
          email: 'test@example.com',
        },
      })
    );
  });

  it('displays error message on failed reset', async () => {
    (useForgotPassword as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      mutate: mockForgotPassword,
      isPending: false,
      isError: true,
      error: { message: 'Reset password failed' },
    });

    fireEvent.change(screen.getByPlaceholderText('Email here'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByRole('button'));

    const errorMessage = await screen.findByText(
      'Reset password failed: Reset password failed'
    );
    expect(errorMessage).toBeTruthy();
  });
});
