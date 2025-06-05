import axios from 'axios';

const API_URL = 'http://localhost:3000/classes';

export interface ClasseData {
  id: number;
  nom: string;
  niveau: string;
  numero_ordre: number;
}

export const ClasseService = {
  // Récupérer toutes les classes
  getAllClasses: async (): Promise<ClasseData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Récupérer une classe par son ID
  getClasseById: async (id: number): Promise<ClasseData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Créer une nouvelle classe
  createClasse: async (classeData: Partial<ClasseData>): Promise<ClasseData> => {
    const response = await axios.post(API_URL, classeData);
    return response.data;
  },

  // Mettre à jour une classe existante
  updateClasse: async (id: number, classeData: Partial<ClasseData>): Promise<ClasseData> => {
    const response = await axios.put(`${API_URL}/${id}`, classeData);
    return response.data;
  },

  // Supprimer une classe
  deleteClasse: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};