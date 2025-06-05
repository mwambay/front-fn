import axios from 'axios';

const API_URL = 'http://localhost:3000/resultats';

export interface ResultatData {
  id: number;
  genre: string;
  moyenne: number;
  mention: string;
  ecole: number | object;
  classe: number | object;
  option: number | object;
  annee: number | object;
}

export const ResultatService = {
  // Récupérer tous les résultats
  getAllResultats: async (): Promise<ResultatData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Récupérer un résultat par son ID
  getResultatById: async (id: number): Promise<ResultatData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Créer un nouveau résultat
  createResultat: async (resultatData: Partial<ResultatData>): Promise<ResultatData> => {
    const response = await axios.post(API_URL, resultatData);
    return response.data;
  },

  // Mettre à jour un résultat existant
  updateResultat: async (id: number, resultatData: Partial<ResultatData>): Promise<ResultatData> => {
    const response = await axios.put(`${API_URL}/${id}`, resultatData);
    return response.data;
  },

  // Supprimer un résultat
  deleteResultat: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};