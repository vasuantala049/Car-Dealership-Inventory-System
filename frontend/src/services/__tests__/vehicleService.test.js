import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import * as vehicleService from '../../services/vehicleService';

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

      const result = await vehicleService.getVehicles();

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
      const result = await vehicleService.searchVehicles(searchParams);

      expect(axios.get).toHaveBeenCalledWith('/api/vehicles/search', {
        params: searchParams,
        headers: { Authorization: 'Bearer fake-jwt-token' }
      });
      expect(result).toEqual(mockVehicles);
    });
    
    it('omits empty parameters from the request', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      
      const searchParams = { make: 'Ford', model: '', category: '' };
      await vehicleService.searchVehicles(searchParams);
      
      expect(axios.get).toHaveBeenCalledWith('/api/vehicles/search', {
        params: { make: 'Ford' },
        headers: { Authorization: 'Bearer fake-jwt-token' }
      });
    });
  });

  // ==========================================
  // Feature 8: Admin CRUD & Purchase API Tests
  // ==========================================

  describe('addVehicle', () => {
    it('sends a POST request to add a new vehicle', async () => {
      // Mocking the successful creation response
      const newVehicle = { make: 'Tesla', model: 'Model 3', price: 40000, quantity: 10, category: 'SEDAN' };
      const savedVehicle = { id: 10, ...newVehicle };
      axios.post.mockResolvedValueOnce({ data: savedVehicle });

      const result = await vehicleService.addVehicle(newVehicle);

      // Verify the POST request URL, payload, and auth headers
      expect(axios.post).toHaveBeenCalledWith('/api/vehicles', newVehicle, {
        headers: { Authorization: 'Bearer fake-jwt-token' }
      });
      expect(result).toEqual(savedVehicle);
    });
  });

  describe('updateVehicle', () => {
    it('sends a PUT request to update an existing vehicle', async () => {
      // Mocking the successful update response
      const updateData = { make: 'Tesla', model: 'Model Y', price: 45000, quantity: 5, category: 'SUV' };
      const updatedVehicle = { id: 10, ...updateData };
      axios.put.mockResolvedValueOnce({ data: updatedVehicle });

      const result = await vehicleService.updateVehicle(10, updateData);

      // Verify the PUT request targeting the specific ID
      expect(axios.put).toHaveBeenCalledWith('/api/vehicles/10', updateData, {
        headers: { Authorization: 'Bearer fake-jwt-token' }
      });
      expect(result).toEqual(updatedVehicle);
    });
  });

  describe('deleteVehicle', () => {
    it('sends a DELETE request to remove a vehicle', async () => {
      // Mocking a successful empty response (e.g., 204 No Content)
      axios.delete.mockResolvedValueOnce({});

      await vehicleService.deleteVehicle(10);

      // Verify the DELETE request targeting the specific ID
      expect(axios.delete).toHaveBeenCalledWith('/api/vehicles/10', {
        headers: { Authorization: 'Bearer fake-jwt-token' }
      });
    });
  });

  describe('purchaseVehicle', () => {
    it('sends a POST request to purchase a vehicle and reduce inventory', async () => {
      // Mocking a successful purchase response
      const updatedVehicle = { id: 1, make: 'Toyota', model: 'Camry', quantity: 4 }; // Quantity went from 5 to 4
      axios.post.mockResolvedValueOnce({ data: updatedVehicle });

      const result = await vehicleService.purchaseVehicle(1);

      // Verify the POST request specifically targeting the purchase endpoint
      expect(axios.post).toHaveBeenCalledWith('/api/vehicles/1/purchase', {}, {
        headers: { Authorization: 'Bearer fake-jwt-token' }
      });
      expect(result).toEqual(updatedVehicle);
    });
  });
});
