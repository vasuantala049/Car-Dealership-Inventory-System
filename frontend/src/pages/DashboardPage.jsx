import { useState, useEffect } from 'react';
import { getVehicles, searchVehicles } from '../services/vehicleService';

function Spinner() {
  return <span className="spinner" role="status" aria-hidden="false" />;
}

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search state
  const [make, setMake] = useState('');
  const [category, setCategory] = useState('');

  const fetchAllVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      setError('Failed to load vehicles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVehicles();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await searchVehicles({ make, category });
      setVehicles(data);
    } catch (err) {
      setError('Failed to load vehicles.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMake('');
    setCategory('');
    fetchAllVehicles();
  };

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', paddingTop: '1rem' }}>
      
      {/* Search / Filter Section */}
      <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '200px' }}>
            <label htmlFor="make">Make</label>
            <input 
              id="make" 
              type="text" 
              placeholder="e.g. Toyota" 
              value={make} 
              onChange={(e) => setMake(e.target.value)} 
              style={{ paddingLeft: '1rem' }} // No icon for this input
            />
          </div>
          
          <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '200px' }}>
            <label htmlFor="category">Category</label>
            <select 
              id="category" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                borderRadius: '14px',
                padding: '0.8rem 1rem',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                outline: 'none',
                appearance: 'none'
              }}
            >
              <option value="">All Categories</option>
              <option value="SEDAN">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="TRUCK">Truck</option>
              <option value="SPORTS">Sports</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn-primary" style={{ marginTop: 0, width: 'auto', padding: '0.8rem 1.5rem' }}>
              Search
            </button>
            <button type="button" className="btn-ghost" onClick={handleClear} style={{ height: '100%' }}>
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Content Section */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Spinner />
        </div>
      ) : error ? (
        <p className="alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          {error}
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {vehicles.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No vehicles found matching your criteria.</p>
          ) : (
            vehicles.map((v) => (
              <div key={v.id} className="glass" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{v.make} {v.model}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    ${v.price.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {v.quantity} in stock
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
