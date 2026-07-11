import { useState, useEffect } from 'react';
import { getMyPurchases } from '../services/vehicleService';

/**
 * My Garage page — shows the authenticated user's personal vehicle purchase history.
 * Each purchased vehicle is displayed as a card with a purchase timestamp.
 */
export default function MyGaragePage() {
  // --- Component State ---
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the user's purchase history when the page first loads
  useEffect(() => {
    async function fetchPurchases() {
      try {
        const data = await getMyPurchases();
        setPurchases(data);
      } catch (err) {
        setError('Failed to load your garage. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchPurchases();
  }, []);

  /**
   * Formats a UTC ISO timestamp into a readable local date string.
   * @param {string} isoString - ISO 8601 timestamp
   * @returns {string} Formatted date, e.g. "12 Jul 2026, 01:45"
   */
  function formatDate(isoString) {
    return new Date(isoString).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  return (
    <main className="dashboard-content">
      <div className="dashboard-hero" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>🏎️ My Garage</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Your purchased vehicles</p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <span className="spinner" role="status" aria-label="Loading" />
        </div>
      )}

      {error && (
        <p style={{ color: 'var(--error)', textAlign: 'center' }}>{error}</p>
      )}

      {!loading && !error && purchases.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚗</p>
          <p>Your garage is empty. Head to the Inventory to buy your first vehicle!</p>
        </div>
      )}

      {/* Grid of purchased vehicle cards */}
      <div className="vehicle-grid">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="vehicle-card glass">
            <div className="vehicle-card-header">
              <span className="vehicle-category-badge">{purchase.category}</span>
            </div>
            <h3 className="vehicle-title">{purchase.make} {purchase.model}</h3>
            <div className="vehicle-price">${Number(purchase.price).toLocaleString()}</div>
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              🗓️ Purchased on {formatDate(purchase.purchasedAt)}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
