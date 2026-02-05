// Save token to localStorage
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Remove token (logout)
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Decode JWT token to get user info (optional)
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};