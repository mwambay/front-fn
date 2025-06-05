import axios from 'axios';

const API_URL = 'http://localhost:3000/ecoles';

export const SchoolService = {
  // Récupérer toutes les écoles
  getAllSchools: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Récupérer une école par son ID
  getSchoolById: async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Créer une nouvelle école
  createSchool: async (schoolData: Partial<SchoolData>) => {
    const response = await axios.post(API_URL, schoolData);
    return response.data;
  },

  // Mettre à jour une école existante
  updateSchool: async (id: number, schoolData: Partial<SchoolData>) => {
    const response = await axios.put(`${API_URL}/${id}`, schoolData);
    return response.data;
  },

  // Supprimer une école
  deleteSchool: async (id: number) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export interface SchoolData {
  id: number;
  nom: string;
  code_ecole: string;
  province: string;
  ville: string;
  commune: string;
  statut: string;
  type_ecole: string;
}