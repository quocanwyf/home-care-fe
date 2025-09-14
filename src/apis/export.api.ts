export interface ExportParams {
  startDate: string;
  endDate: string;
}

export const downloadExcelExportApi = async (
  params: ExportParams,
  signal?: AbortSignal
): Promise<Blob> => {
  const queryParams = new URLSearchParams();
  queryParams.append('startDate', params.startDate);
  queryParams.append('endDate', params.endDate);

  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/exports/data?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    signal,
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  // Return blob for file download
  const blob = await response.blob();
  return blob;
};
