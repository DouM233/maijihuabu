import { getLocalUserHeaders } from './localUser';

interface UploadAssetResponse {
  data?: {
    url: string;
    mimeType: string;
    originalName: string;
  };
  error?: string;
}

export async function uploadAssetFile(file: File, canvasId?: string | null) {
  const formData = new FormData();
  formData.append('file', file);
  if (canvasId) {
    formData.append('canvasId', canvasId);
  }

  const response = await fetch('/api/assets/upload', {
    method: 'POST',
    headers: getLocalUserHeaders(),
    body: formData,
  });

  const result = (await response.json()) as UploadAssetResponse;
  if (!response.ok || !result.data?.url) {
    throw new Error(result.error || `Upload failed with status ${response.status}`);
  }

  return result.data;
}
