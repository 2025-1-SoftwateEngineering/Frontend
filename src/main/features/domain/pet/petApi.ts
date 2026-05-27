import { apiFetch, API_URL } from '../../../config/apiConfig';
import type { PetStage } from './types';

export interface PetInfo {
  petId:                  number;
  level:                  number;
  stage:                  PetStage;
  currentXp:              number;
  hunger:                 number;
  thirst:                 number;
  activeBackgroundItemId: number | null;
  activeAccessoryItemId:  number | null;
  petImageUrl:            string;
  activeBackgroundUrl:    string | null;
  activeAccessoryUrl:     string | null;
  foodCount:              number;
  waterCount:             number;
}

export const petApi = {
  /** GET /api/v1/pets/me */
  getMyPet: async (): Promise<PetInfo> => {
    const res = await apiFetch<PetInfo>('/pets/me', {}, API_URL);
    return res.result!;
  },

  /** POST /api/v1/pets */
  createPet: async (): Promise<PetInfo> => {
    const res = await apiFetch<PetInfo>('/pets', { method: 'POST' }, API_URL);
    return res.result!;
  },
};
