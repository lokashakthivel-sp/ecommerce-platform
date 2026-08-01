export const saveAuth = (token: string, userId: string, email: string, role: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
  localStorage.setItem('email', email);
  localStorage.setItem('role', role);
};

export const getAuth = () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');
  if (!token || !userId) return null;
  return { token, userId, email, role };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('email');
  localStorage.removeItem('role');
};

export const isLoggedIn = () => {
  return !!getAuth();
};