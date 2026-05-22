import { apiFetch, API_URL } from '../../../config/apiConfig';

export interface AlertDto {
  alertId: number;
  message: string;
  repeat: 'NONE' | 'DAY' | 'WEEK';
  alertedAt: string;
  createdAt: string;
}

interface AlertListResult {
  alerts: AlertDto[];
  cursor: number | null;
  hasMore: boolean;
}

export const alertApi = {
  registerFcmToken: async (fcmToken: string) => {
    await apiFetch('/fcm', { method: 'POST', body: JSON.stringify({ fcmToken }) }, API_URL);
  },

  createAlert: async (data: {
    message: string;
    repeat: 'NONE' | 'DAY' | 'WEEK';
    alertedAt: string;
  }) => {
    await apiFetch('/alerts/custom', { method: 'POST', body: JSON.stringify(data) }, API_URL);
  },

  getAlerts: async (cursor?: number, pageSize = 20): Promise<AlertListResult | null> => {
    const query = new URLSearchParams({ pageSize: String(pageSize) });
    if (cursor !== undefined) query.set('cursor', String(cursor));
    const res = await apiFetch<AlertListResult>(`/alerts?${query}`, {}, API_URL);
    return res.result;
  },

  deleteAlert: async (alertId: number) => {
    await apiFetch(`/alerts/${alertId}`, { method: 'DELETE' }, API_URL);
  },
};
