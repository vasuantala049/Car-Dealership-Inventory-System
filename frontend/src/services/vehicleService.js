import axios from 'axios';

/**
 * Helper function to retrieve the JWT token from localStorage and 
 * format it into an Authorization header for Axios requests.
 * @returns {Object} Axios configuration object containing the headers
 */
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
}

/**
 * Retrieves the complete list of vehicles from the API.
 * @returns {Promise<Array>} List of vehicle objects
 */
export async function getVehicles() {
  const response = await axios.get('/api/vehicles', getAuthHeaders());
  return response.data;
}

/**
 * Searches for vehicles based on specific filter parameters.
 * Automatically cleans out empty, null, or undefined parameters before sending the request.
 * @param {Object} params - Search criteria (e.g., { make: 'Toyota', category: 'Sedan' })
 * @returns {Promise<Array>} List of matching vehicle objects
 */
export async function searchVehicles(params) {
  // Remove empty values to match what the backend expects and keep URLs clean
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
 * Buys a vehicle, decreasing its available quantity.
 * The backend records this under the authenticated user's email.
 */
export async function purchaseVehicle(id) {
  const response = await axios.post(`/api/vehicles/${id}/purchase`, {}, getAuthHeaders());
  return response.data;
}

/**
 * Restocks a vehicle by a given amount (Admin only).
 * @param {number} id - Vehicle ID
 * @param {number} amount - Quantity to add to the current stock
 */
export async function restockVehicle(id, amount) {
  const response = await axios.post(
    `/api/vehicles/${id}/restock`,
    { amount },
    getAuthHeaders()
  );
  return response.data;
}

/**
 * Fetches the authenticated user's vehicle purchase history ("My Garage").
 * @returns {Promise<Array>} List of purchase records ordered by most recent first
 */
export async function getMyPurchases() {
  const response = await axios.get('/api/purchases/my', getAuthHeaders());
  return response.data;
}
