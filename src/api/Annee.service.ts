import axios from 'axios';

const API_URL = 'http://localhost:3000/annees-scolaires'; // Correction ici

export interface AnneeData {
  id: number;
  libelle: string;
}

export const AnneeService = {
  // Récupérer toutes les années
  getAllAnnees: async (): Promise<AnneeData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Récupérer une année par son ID
  getAnneeById: async (id: number): Promise<AnneeData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Créer une nouvelle année
  createAnnee: async (anneeData: Partial<AnneeData>): Promise<AnneeData> => {
    const response = await axios.post(API_URL, anneeData);
    return response.data;
  },

  // Mettre à jour une année existante
  updateAnnee: async (id: number, anneeData: Partial<AnneeData>): Promise<AnneeData> => {
    const response = await axios.put(`${API_URL}/${id}`, anneeData);
    return response.data;
  },

  // Supprimer une année
  deleteAnnee: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};