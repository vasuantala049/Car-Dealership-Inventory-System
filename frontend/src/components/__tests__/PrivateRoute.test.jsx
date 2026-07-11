import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../components/PrivateRoute';

const renderWithRouter = (token, initialRoute = '/dashboard') => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }

  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div>Protected Content</div>
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('PrivateRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders child component when token is present in localStorage', () => {
    renderWithRouter('valid-jwt-token');

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to /login when no token is in localStorage', () => {
    renderWithRouter(null);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
