export const logoutApi = async (): Promise<void> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/auth/logout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    console.warn('Logout API failed, but proceeding with client logout');
  }
};
