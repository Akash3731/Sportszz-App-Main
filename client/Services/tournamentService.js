import axios from 'axios';
import config from '../components/config';

// Base API URL
const API_URL = `${config.backendUrl}/tournaments`;

// Function to create a tournament
export const createTournament = async (tournamentData) => {
  const response = await axios.post(`${API_URL}`, tournamentData);
  return response.data;
};

// Function to get all tournaments
export const getTournaments = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

// Function to delete a tournament by ID
export const deleteTournament = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting tournament:', error.message);
    throw error; // Rethrow the error to handle it in the component
  }
};

// Function to update a tournament by ID
export const updateTournament = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating tournament:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to toggle tournament's favorite status 

export const getTournamentById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  console.log('API Response:', response.data);
  return response.data;
};

export const toggleFavorite = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/favorite`);
    return response.data;
  } catch (error) {
    console.error('Error toggling favorite:', error.message);
    throw error;
  }
};


