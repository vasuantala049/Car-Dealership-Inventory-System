import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '../../pages/DashboardPage';
import * as vehicleService from '../../services/vehicleService';

vi.mock('../../services/vehicleService');

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a loading state initially', () => {
    vehicleService.getVehicles.mockReturnValueOnce(new Promise(() => {}));
    
    render(<DashboardPage />);
    
    expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner
  });

  it('renders a list of vehicles', async () => {
    const mockVehicles = [
      { id: 1, make: 'Toyota', model: 'Camry', category: 'SEDAN', price: 25000, quantity: 5 },
      { id: 2, make: 'Honda', model: 'CR-V', category: 'SUV', price: 30000, quantity: 2 }
    ];
    vehicleService.getVehicles.mockResolvedValueOnce(mockVehicles);
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
      expect(screen.getByText('Honda CR-V')).toBeInTheDocument();
    });
    
    expect(screen.getByText('$25,000')).toBeInTheDocument();
    expect(screen.getByText('5 in stock')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    vehicleService.getVehicles.mockRejectedValueOnce(new Error('Failed to fetch'));
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load vehicles/i)).toBeInTheDocument();
    });
  });

  it('allows searching vehicles by make and category', async () => {
    vehicleService.getVehicles.mockResolvedValueOnce([]); // Initial load
    const mockSearchResults = [
      { id: 3, make: 'Ford', model: 'Mustang', category: 'SPORTS', price: 40000, quantity: 1 }
    ];
    vehicleService.searchVehicles.mockResolvedValueOnce(mockSearchResults);
    
    render(<DashboardPage />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(vehicleService.getVehicles).toHaveBeenCalled();
    });
    
    // Fill out search form
    const makeInput = screen.getByLabelText(/make/i);
    const categorySelect = screen.getByLabelText(/category/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    await userEvent.type(makeInput, 'Ford');
    await userEvent.selectOptions(categorySelect, 'SPORTS');
    await userEvent.click(searchButton);
    
    await waitFor(() => {
      expect(vehicleService.searchVehicles).toHaveBeenCalledWith(
        expect.objectContaining({ make: 'Ford', category: 'SPORTS' })
      );
      expect(screen.getByText('Ford Mustang')).toBeInTheDocument();
    });
  });
  
  it('allows clearing the search filters', async () => {
    vehicleService.getVehicles.mockResolvedValue([]);
    vehicleService.searchVehicles.mockResolvedValue([]);
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(vehicleService.getVehicles).toHaveBeenCalledTimes(1);
    });
    
    const makeInput = screen.getByLabelText(/make/i);
    await userEvent.type(makeInput, 'Ford');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));
    
    await waitFor(() => {
      expect(vehicleService.searchVehicles).toHaveBeenCalledTimes(1);
    });
    
    await userEvent.click(screen.getByRole('button', { name: /clear/i }));
    
    expect(makeInput).toHaveValue('');
    expect(vehicleService.getVehicles).toHaveBeenCalledTimes(2);
  });

  // ==========================================
  // Feature 8: Purchase Functionality Tests
  // ==========================================

  it('allows a user to purchase a vehicle and updates the inventory count', async () => {
    // 1. Initial Load setup
    const initialVehicles = [
      { id: 1, make: 'Toyota', model: 'Camry', category: 'SEDAN', price: 25000, quantity: 5 }
    ];
    vehicleService.getVehicles.mockResolvedValueOnce(initialVehicles);
    
    render(<DashboardPage />);
    
    // Wait for the car to appear on the screen
    await waitFor(() => {
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
      expect(screen.getByText('5 in stock')).toBeInTheDocument();
    });

    // 2. Setup mock for the purchase action
    // The API should return the vehicle with decremented quantity (4)
    const purchasedVehicle = { ...initialVehicles[0], quantity: 4 };
    vehicleService.purchaseVehicle.mockResolvedValueOnce(purchasedVehicle);

    // 3. Find and click the 'Buy' button
    const buyButton = screen.getByRole('button', { name: /buy/i });
    await userEvent.click(buyButton);

    // 4. Verify API call was made and UI reflects the new quantity
    await waitFor(() => {
      expect(vehicleService.purchaseVehicle).toHaveBeenCalledWith(1); // 1 is the vehicle ID
      expect(screen.getByText('4 in stock')).toBeInTheDocument();
      // Ensure the old text is gone
      expect(screen.queryByText('5 in stock')).not.toBeInTheDocument();
    });
  });

  it('shows an error if the purchase fails', async () => {
    const initialVehicles = [
      { id: 1, make: 'Toyota', model: 'Camry', category: 'SEDAN', price: 25000, quantity: 1 }
    ];
    vehicleService.getVehicles.mockResolvedValueOnce(initialVehicles);
    
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    });

    // Mock API failure (e.g. Out of stock error from backend)
    vehicleService.purchaseVehicle.mockRejectedValueOnce(new Error('Out of stock'));

    const buyButton = screen.getByRole('button', { name: /buy/i });
    await userEvent.click(buyButton);

    // The dashboard should display an error alert
    await waitFor(() => {
      expect(screen.getByText(/Failed to purchase vehicle/i)).toBeInTheDocument();
    });
  });
});
