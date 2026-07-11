import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

function Dashboard() {
  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header glass">
        <h1>🚗 Car Dealership</h1>
        <button className="btn-ghost" onClick={handleLogout}>Log Out</button>
      </header>
      <main style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', paddingTop: '4rem', opacity: 0.6 }}>
        <p style={{ fontSize: '1.2rem' }}>Dashboard coming in Feature 7 🚀</p>
      </main>
    </div>
  );
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
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
