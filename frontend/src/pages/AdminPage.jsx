import { useState, useEffect } from 'react';
import { getVehicles, addVehicle, deleteVehicle } from '../services/vehicleService';

export default function AdminPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  // 1. Fetch initial vehicles
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle adding a new vehicle
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setError('');
    
    const newVehicle = {
      make,
      model,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10)
    };

    try {
      const addedVehicle = await addVehicle(newVehicle);
      // Append newly added vehicle to the local state
      setVehicles([...vehicles, addedVehicle]);
      
      // Reset form fields
      setMake('');
      setModel('');
      setCategory('');
      setPrice('');
      setQuantity('');
    } catch (err) {
      setError('Failed to save vehicle');
    }
  };

  // 3. Handle deleting a vehicle
  const handleDelete = async (id) => {
    try {
      await deleteVehicle(id);
      // Remove deleted vehicle from local state
      setVehicles(vehicles.filter((v) => v.id !== id));
    } catch (err) {
      setError('Failed to delete vehicle');
    }
  };

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', paddingTop: '1rem', paddingBottom: '3rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Admin Dashboard</h1>
      
      {error && (
        <p className="alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          {error}
        </p>
      )}

      {/* Add New Vehicle Form */}
      <div className="glass" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Add New Vehicle</h2>
        <form onSubmit={handleAddVehicle} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="make">Make</label>
            <input id="make" required value={make} onChange={e => setMake(e.target.value)} placeholder="e.g. Ford" style={{ paddingLeft: '1rem' }} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="model">Model</label>
            <input id="model" required value={model} onChange={e => setModel(e.target.value)} placeholder="e.g. Mustang" style={{ paddingLeft: '1rem' }} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="category">Category</label>
            <select id="category" required value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '14px', padding: '0.8rem 1rem', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none' }}>
              <option value="" disabled>Select Category</option>
              <option value="SEDAN">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="TRUCK">Truck</option>
              <option value="SPORTS">Sports</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="price">Price ($)</label>
            <input id="price" type="number" required min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 25000" style={{ paddingLeft: '1rem' }} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="quantity">Quantity</label>
            <input id="quantity" type="number" required min="0" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g. 5" style={{ paddingLeft: '1rem' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ marginTop: 0 }}>Save Vehicle</button>
          </div>
        </form>
      </div>

      {/* Vehicle Inventory List */}
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Inventory List</h2>
      {loading ? (
        <p>Loading inventory...</p>
      ) : vehicles.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No vehicles found.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {vehicles.map((v) => (
            <div key={v.id} className="glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{v.make} {v.model}</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span style={{ marginRight: '1rem' }}>{v.category}</span>
                  <span style={{ marginRight: '1rem' }}>${v.price.toLocaleString()}</span>
                  <span>{v.quantity} in stock</span>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(v.id)} 
                className="btn-ghost" 
                style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
