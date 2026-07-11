import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';
import * as authService from '../../services/authService';

vi.mock('../../services/authService');

const renderWithRouter = (ui, { route = '/login' } = {}) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/login" element={ui} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders email and password fields and a submit button', () => {
    renderWithRouter(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('has a link to the register page', () => {
    renderWithRouter(<LoginPage />);

    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });

  it('stores JWT in localStorage and redirects to dashboard on successful login', async () => {
    authService.login.mockResolvedValueOnce({ token: 'jwt-abc' });

    renderWithRouter(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('jwt-abc');
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('shows an error message on invalid credentials', async () => {
    authService.login.mockRejectedValueOnce({ response: { status: 401 } });

    renderWithRouter(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/email/i), 'bad@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(/invalid email or password/i);
    });
  });

  it('disables submit button while login is in progress', async () => {
    authService.login.mockReturnValueOnce(new Promise(() => {}));

    renderWithRouter(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled();
  });
});
