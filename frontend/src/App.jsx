import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import MyGaragePage from './pages/MyGaragePage';
import { Link } from 'react-router-dom';

/**
 * Extracts and decodes the user role securely from the JWT token stored in localStorage.
 * Automatically handles Base64Url padding and URL-safe characters.
 * @returns {string|null} The user's role (e.g., 'ADMIN', 'USER') or null if invalid/missing.
 */
function getUserRole() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    return payload.role;
  } catch (e) {
    return null;
  }
}

/**
 * Layout wrapper for authenticated pages that displays a persistent top navigation bar.
 * Conditionally renders links based on the user's role (e.g., hiding Admin controls from standard users).
 * @param {Object} props - React props
 * @param {React.ReactNode} props.children - Child components to render inside the layout
 */
function DashboardLayout({ children }) {
  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  const role = getUserRole();

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header glass">
        <h1>🚗 Car Dealership</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Inventory</Link>
          {role === 'ADMIN' && (
            <Link to="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Admin</Link>
          )}
          {/* My Garage: visible to all logged-in users, left of the Log Out button */}
          <Link to="/my-garage" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>🏎️ My Garage</Link>
          <button className="btn-ghost" onClick={handleLogout}>Log Out</button>
        </div>
      </header>
      {children}
    </div>
  );
}

function AdminRoute({ children }) {
  const role = getUserRole();
  return role === 'ADMIN' ? children : <Navigate to="/dashboard" replace />;
}

/** Redirect already-logged-in users away from auth pages */
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" replace /> : children;
}

/** Decide where `/` goes based on auth state */
function RootRedirect() {
  const token = localStorage.getItem('token');
  return <Navigate to={token ? '/dashboard' : '/login'} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        
        {/* Protected Routes using DashboardLayout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminRoute>
                <DashboardLayout>
                  <AdminPage />
                </DashboardLayout>
              </AdminRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/my-garage"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <MyGaragePage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
