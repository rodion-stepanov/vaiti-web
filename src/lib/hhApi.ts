import { api } from './api';

// --- Types ---
export interface Area {
  id: string;
  name: string;
  areas: Area[];
}

// --- API Functions ---
export const getAreas = async (): Promise<Area[]> => {
  try {
    const response = await api.get<Area[]>('/v1/hh/vacancies/area');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch areas:', error);
    return [];
  }
};
