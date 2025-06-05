import axios from 'axios';

const API_URL = 'http://localhost:3000/options';

export interface OptionData {
  id: number;
  nom: string;
}

export const OptionService = {
  // Récupérer toutes les options
  getAllOptions: async (): Promise<OptionData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Récupérer une option par son ID
  getOptionById: async (id: number): Promise<OptionData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Créer une nouvelle option
  createOption: async (optionData: Partial<OptionData>): Promise<OptionData> => {
    const response = await axios.post(API_URL, optionData);
    return response.data;
  },

  // Mettre à jour une option existante
  updateOption: async (id: number, optionData: Partial<OptionData>): Promise<OptionData> => {
    const response = await axios.put(`${API_URL}/${id}`, optionData);
    return response.data;
  },

  // Supprimer une option
  deleteOption: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};