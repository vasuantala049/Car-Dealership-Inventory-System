import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminPage from '../../pages/AdminPage';
import * as vehicleService from '../../services/vehicleService';

// Mock the vehicle service to avoid real network requests
vi.mock('../../services/vehicleService');

describe('AdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // Admin Feature 8: CRUD Operations Testing
  // ==========================================

  it('renders the initial list of vehicles and the add vehicle form', async () => {
    // 1. Mock the API to return some vehicles
    const mockVehicles = [
      { id: 1, make: 'Honda', model: 'Civic', category: 'SEDAN', price: 22000, quantity: 3 }
    ];
    vehicleService.getVehicles.mockResolvedValueOnce(mockVehicles);
    
    // 2. Render the page
    render(<AdminPage />);
    
    // 3. Verify loading state is handled and content appears
    await waitFor(() => {
      // Verify list content
      expect(screen.getByText('Honda Civic')).toBeInTheDocument();
      expect(screen.getByText('3 in stock')).toBeInTheDocument();
      
      // Verify form elements exist
      expect(screen.getByRole('heading', { name: /add new vehicle/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save vehicle/i })).toBeInTheDocument();
    });
  });

  it('allows an admin to add a new vehicle', async () => {
    // 1. Mock empty initial list, and then mock the add API
    vehicleService.getVehicles.mockResolvedValueOnce([]);
    
    const newVehicle = { id: 2, make: 'Ford', model: 'Mustang', category: 'SPORTS', price: 45000, quantity: 2 };
    vehicleService.addVehicle.mockResolvedValueOnce(newVehicle);
    
    render(<AdminPage />);
    await waitFor(() => expect(vehicleService.getVehicles).toHaveBeenCalled());
    
    // 2. Fill out the "Add Vehicle" form
    await userEvent.type(screen.getByLabelText(/make/i), 'Ford');
    await userEvent.type(screen.getByLabelText(/model/i), 'Mustang');
    await userEvent.selectOptions(screen.getByLabelText(/category/i), 'SPORTS');
    await userEvent.type(screen.getByLabelText(/price/i), '45000');
    await userEvent.type(screen.getByLabelText(/quantity/i), '2');
    
    // 3. Submit the form
    await userEvent.click(screen.getByRole('button', { name: /save vehicle/i }));
    
    // 4. Verify API was called with the correct data and UI updated
    await waitFor(() => {
      expect(vehicleService.addVehicle).toHaveBeenCalledWith(
        expect.objectContaining({
          make: 'Ford',
          model: 'Mustang',
          category: 'SPORTS',
          price: 45000,
          quantity: 2
        })
      );
      // The new car should now be visible on the screen
      expect(screen.getByText('Ford Mustang')).toBeInTheDocument();
    });
  });

  it('allows an admin to delete a vehicle', async () => {
    // 1. Render page with a vehicle
    const mockVehicles = [
      { id: 1, make: 'Toyota', model: 'Corolla', category: 'SEDAN', price: 20000, quantity: 10 }
    ];
    vehicleService.getVehicles.mockResolvedValueOnce(mockVehicles);
    vehicleService.deleteVehicle.mockResolvedValueOnce({}); // successful deletion
    
    render(<AdminPage />);
    
    // 2. Wait for the car to appear
    await waitFor(() => {
      expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
    });
    
    // 3. Click the delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);
    
    // 4. Verify API call and removal from UI
    await waitFor(() => {
      expect(vehicleService.deleteVehicle).toHaveBeenCalledWith(1);
      expect(screen.queryByText('Toyota Corolla')).not.toBeInTheDocument();
    });
  });

  it('shows an error if saving a vehicle fails', async () => {
    vehicleService.getVehicles.mockResolvedValueOnce([]);
    // Mock the API throwing an error
    vehicleService.addVehicle.mockRejectedValueOnce(new Error('Validation failed'));
    
    render(<AdminPage />);
    await waitFor(() => expect(vehicleService.getVehicles).toHaveBeenCalled());
    
    // Fill out the required fields
    await userEvent.type(screen.getByLabelText(/make/i), 'Tesla');
    await userEvent.type(screen.getByLabelText(/model/i), 'Model 3');
    await userEvent.selectOptions(screen.getByLabelText(/category/i), 'SEDAN');
    await userEvent.type(screen.getByLabelText(/price/i), '40000');
    await userEvent.type(screen.getByLabelText(/quantity/i), '5');
    
    await userEvent.click(screen.getByRole('button', { name: /save vehicle/i }));
    
    // Verify error message is shown to user
    await waitFor(() => {
      expect(screen.getByText(/Failed to save vehicle/i)).toBeInTheDocument();
    });
  });
});
