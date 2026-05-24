import { apiFetch, API_URL } from '../../../config/apiConfig';

function timeToIso(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  const offset = -d.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const pad = (n: number) => String(n).padStart(2, '0');
  const offsetStr = `${sign}${pad(Math.floor(absOffset / 60))}:${pad(absOffset % 60)}`;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(hours)}:${pad(minutes)}:00${offsetStr}`;
}

export interface AlertDto {
  alertId: number;
  message: string;
  repeat: 'NONE' | 'DAY' | 'WEEK';
  alertedAt: string;
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
    await apiFetch('/alerts/custom', {
      method: 'POST',
      body: JSON.stringify({ ...data, alertedAt: timeToIso(data.alertedAt) }),
    }, API_URL);
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
