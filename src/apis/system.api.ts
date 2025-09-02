import type {
  SystemConfig,
  SystemResponse,
  UpdateSystemResponse,
} from '@/types/params/system-params';

export const getSystemConfigApi = async (
  signal?: AbortSignal
): Promise<SystemResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/generalSettings`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch system config: ${response.status}`);
    }

    const data: SystemResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching system config:', error);
    throw new Error('Server error');
  }
};

export const updateSystemConfigApi = async (
  systemData: SystemConfig,
  signal?: AbortSignal
): Promise<UpdateSystemResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/generalSettings/update`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(systemData),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to update system config: ${response.status}`);
    }

    const data: UpdateSystemResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating system config:', error);
    throw new Error('Server error');
  }
};
