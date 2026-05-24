import { apiFetch, API_URL } from '../../../config/apiConfig';

export interface SignedUriResult {
  url:       string;
  fileName:  string;
  photoType: string;
}

export interface UploadImageResult {
  publicUrl: string;
  uploadAt:  string;
}

export const imageApi = {
  /** POST /api/v1/images?fileName=xxx&photoType=PROFILE */
  createSignedUri: async (fileName: string): Promise<SignedUriResult> => {
    const params = new URLSearchParams({ fileName, photoType: 'PROFILE' });
    const res = await apiFetch<SignedUriResult>(`/images?${params}`, { method: 'POST' }, API_URL);
    return res.result!;
  },

  /** GCS Signed URL에 직접 PUT 업로드 (인증 헤더 불필요) */
  uploadToGcs: async (signedUrl: string, file: File): Promise<void> => {
    const res = await fetch(signedUrl, {
      method:  'PUT',
      body:    file,
      headers: { 'Content-Type': file.type },
    });
    if (!res.ok) throw new Error(`GCS upload failed: ${res.status}`);
  },

  /** POST /api/v1/images/done?fileName=xxx&photoType=PROFILE */
  confirmUpload: async (fileName: string): Promise<UploadImageResult> => {
    const params = new URLSearchParams({ fileName, photoType: 'PROFILE' });
    const res = await apiFetch<UploadImageResult>(`/images/done?${params}`, { method: 'POST' }, API_URL);
    return res.result!;
  },
};
