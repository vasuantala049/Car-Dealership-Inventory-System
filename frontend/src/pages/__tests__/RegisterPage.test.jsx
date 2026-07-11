import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from '../../pages/RegisterPage';
import * as authService from '../../services/authService';

vi.mock('../../services/authService');

const renderWithRouter = (ui, { route = '/register' } = {}) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/register" element={ui} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email, password fields and a submit button', () => {
    renderWithRouter(<RegisterPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('has a link to the login page', () => {
    renderWithRouter(<RegisterPage />);

    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
  });

  it('redirects to login page on successful registration', async () => {
    authService.register.mockResolvedValueOnce({ id: 1, email: 'new@example.com' });

    renderWithRouter(<RegisterPage />);

    await userEvent.type(screen.getByLabelText(/email/i), 'new@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('shows an error message when email already exists (409)', async () => {
    authService.register.mockRejectedValueOnce({ response: { status: 409 } });

    renderWithRouter(<RegisterPage />);

    await userEvent.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(/email already exists/i);
    });
  });

  it('disables submit button while request is in progress', async () => {
    authService.register.mockReturnValueOnce(new Promise(() => {}));

    renderWithRouter(<RegisterPage />);

    await userEvent.type(screen.getByLabelText(/email/i), 'new@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(screen.getByRole('button', { name: /register/i })).toBeDisabled();
  });
});
