// API base URL from environment variable, fallback to localhost:3001
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API calls with authentication
export const apiCall = async (endpoint, method = 'GET', body = null, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const defaultOptions = {
    method,
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  // Don't set Content-Type for FormData, let the browser set it with boundary
  if (!(body instanceof FormData)) {
    defaultOptions.headers['Content-Type'] = 'application/json';
  }

  if (body) {
    defaultOptions.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  console.log("Making API call to:", url);
  console.log("Request options:", { ...defaultOptions, ...options });
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    console.log("Response headers:", response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      
      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.log("API call error:", error);
    throw error;
  }
};

// Helper function to get image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  return `${API_BASE_URL}/${imagePath.replace('public/', '')}`;
}; 