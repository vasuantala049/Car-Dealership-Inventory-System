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
