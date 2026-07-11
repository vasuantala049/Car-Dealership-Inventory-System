import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { getVehicles, searchVehicles } from '../../services/vehicleService';

vi.mock('axios');

describe('vehicleService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set a mock token for auth headers if needed
    localStorage.setItem('token', 'fake-jwt-token');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('getVehicles', () => {
    it('fetches all vehicles with auth header', async () => {
      const mockVehicles = [{ id: 1, make: 'Toyota', model: 'Camry' }];
      axios.get.mockResolvedValueOnce({ data: mockVehicles });

      const result = await getVehicles();

      expect(axios.get).toHaveBeenCalledWith('/api/vehicles', {
        headers: { Authorization: 'Bearer fake-jwt-token' }
      });
      expect(result).toEqual(mockVehicles);
    });
  });

  describe('searchVehicles', () => {
    it('fetches vehicles matching search criteria', async () => {
      const mockVehicles = [{ id: 2, make: 'Honda', model: 'Civic', category: 'SEDAN', price: 20000 }];
      axios.get.mockResolvedValueOnce({ data: mockVehicles });

      const searchParams = { make: 'Honda', category: 'SEDAN' };
      const result = await searchVehicles(searchParams);

      expect(axios.get).toHaveBeenCalledWith('/api/vehicles/search', {
        params: searchParams,
        headers: { Authorization: 'Bearer fake-jwt-token' }
      });
      expect(result).toEqual(mockVehicles);
    });
    
    it('omits empty parameters from the request', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      
      const searchParams = { make: 'Ford', model: '', category: '' };
      await searchVehicles(searchParams);
      
      expect(axios.get).toHaveBeenCalledWith('/api/vehicles/search', {
        params: { make: 'Ford' },
        headers: { Authorization: 'Bearer fake-jwt-token' }
      });
    });
  });
});
