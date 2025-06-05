import axios from 'axios';

const API_URL = 'http://localhost:3000/calculations';

export interface SchoolRankingData {
    id: number;
    nom: string;
    ville: string;
    commune: string;
    moyenne: number;
    tauxReussite: number;
    optionPrincipale: string;
    rang: number;
    nombreEleves: number;
  }

export interface GlobalStats {
  moyenneGenerale: number;
  tauxReussiteGlobal: number;
  nombreEcoles: number;
  nombreEleves: number;
}

export const CalculationService = {
  // Obtenir le taux de réussite
  getTauxReussite: async (
    ecoleId: number, 
    anneeId: number, 
    classeId?: number, 
    optionId?: number
  ): Promise<number> => {
    const params = { ecoleId, anneeId, classeId, optionId };
    const response = await axios.get(`${API_URL}/taux-reussite`, { params });
    return response.data;
  },

  // Obtenir le taux d'échec
  getTauxEchec: async (
    ecoleId: number, 
    anneeId: number, 
    classeId?: number, 
    optionId?: number
  ): Promise<number> => {
    const params = { ecoleId, anneeId, classeId, optionId };
    const response = await axios.get(`${API_URL}/taux-echec`, { params });
    return response.data;
  },

  // Obtenir le taux de mention
  getTauxMention: async (
    ecoleId: number, 
    anneeId: number, 
    mention: string, 
    classeId?: number, 
    optionId?: number
  ): Promise<number> => {
    const params = { ecoleId, anneeId, mention, classeId, optionId };
    const response = await axios.get(`${API_URL}/taux-mention`, { params });
    return response.data;
  },

  // Obtenir la moyenne générale
  getMoyenneGenerale: async (
    ecoleId: number, 
    anneeId: number, 
    classeId?: number, 
    optionId?: number
  ): Promise<number> => {
    const params = { ecoleId, anneeId, classeId, optionId };
    const response = await axios.get(`${API_URL}/moyenne-generale`, { params });
    return response.data;
  },

  // Obtenir l'évolution du taux de réussite
  getEvolutionTauxReussite: async (
    ecoleId: number, 
    anneeN: number, 
    anneeNmoins1: number, 
    classeId?: number, 
    optionId?: number
  ): Promise<number> => {
    const params = { ecoleId, anneeN, anneeNmoins1, classeId, optionId };
    const response = await axios.get(`${API_URL}/evolution-taux-reussite`, { params });
    return response.data;
  },

  // Obtenir le classement des écoles
  getSchoolRankings: async (
    anneeId: number,
    ville?: string,
    classeId?: number,
    optionId?: number,
    genre?: string
  ): Promise<SchoolRankingData[]> => {
    const params = { anneeId, ville, classeId, optionId, genre };
    const response = await axios.get(`${API_URL}/school-rankings`, { params });
    return response.data;
  },

  // Obtenir les statistiques globales
  getGlobalStats: async (anneeId: number): Promise<GlobalStats> => {
    const params = { anneeId };
    const response = await axios.get(`${API_URL}/stats-globales`, { params });
    return response.data;
  },

  // Obtenir l'option principale d'une école
  getOptionPrincipale: async (ecoleId: number): Promise<string> => {
    const params = { ecoleId };
    const response = await axios.get(`${API_URL}/option-principale`, { params });
    return response.data;
  }
};