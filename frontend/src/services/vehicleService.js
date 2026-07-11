import axios from 'axios';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
}

export async function getVehicles() {
  const response = await axios.get('/api/vehicles', getAuthHeaders());
  return response.data;
}

export async function searchVehicles(params) {
  // Remove empty values to match what the test expects
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
  );

  const response = await axios.get('/api/vehicles/search', {
    ...getAuthHeaders(),
    params: cleanParams
  });
  return response.data;
}

// ---------------------------------------------------------
// Feature 8: Admin & Purchase Endpoints
// ---------------------------------------------------------

/**
 * Creates a new vehicle in the inventory (Admin only)
 */
export async function addVehicle(vehicleData) {
  const response = await axios.post('/api/vehicles', vehicleData, getAuthHeaders());
  return response.data;
}

/**
 * Updates an existing vehicle (Admin only)
 */
export async function updateVehicle(id, vehicleData) {
  const response = await axios.put(`/api/vehicles/${id}`, vehicleData, getAuthHeaders());
  return response.data;
}

/**
 * Deletes a vehicle from the inventory (Admin only)
 */
export async function deleteVehicle(id) {
  const response = await axios.delete(`/api/vehicles/${id}`, getAuthHeaders());
  return response.data;
}

/**
 * Buys a vehicle, decreasing its available quantity
 */
export async function purchaseVehicle(id) {
  const response = await axios.post(`/api/vehicles/${id}/purchase`, {}, getAuthHeaders());
  return response.data;
}
