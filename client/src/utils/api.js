// API base URL from environment variable, fallback to localhost:3001
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  console.log("getAuthToken - Token from localStorage:", token ? token.substring(0, 50) + "..." : "No token");
  return token;
};

// Helper function to make API calls with authentication
export const apiCall = async (endpoint, method = 'GET', body = null, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const defaultOptions = {
    method,
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  };

  // Add other headers after Authorization to ensure it's not overridden
  if (options.headers) {
    defaultOptions.headers = { ...defaultOptions.headers, ...options.headers };
  }

  // Don't set Content-Type for FormData, let the browser set it with boundary
  if (!(body instanceof FormData)) {
    defaultOptions.headers['Content-Type'] = 'application/json';
  } else {
    // For FormData, ensure Authorization header is preserved
    console.log("FormData detected - preserving Authorization header");
  }

  if (body) {
    defaultOptions.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  console.log("Making API call to:", url);
  console.log("Token exists:", !!token);
  console.log("Token value:", token ? token.substring(0, 20) + "..." : "No token");
  console.log("Request options:", { ...defaultOptions, ...options });
  
  try {
    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    // For FormData requests, ensure Authorization header is explicitly set
    const fetchOptions = { 
      ...defaultOptions, 
      ...options,
      signal: controller.signal 
    };
    
    // Explicitly set Authorization header for FormData requests
    if (body instanceof FormData && token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token}`
      };
      console.log("FormData request - Explicitly setting Authorization header");
    }
    
    const response = await fetch(url, fetchOptions);
    
    clearTimeout(timeoutId);
    
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    console.log("Response headers:", response.headers);
    
          if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        
        if (response.status === 401) {
          // Token expired or invalid, redirect to login
          console.log("401 Unauthorized - Token might be invalid");
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
  if (!imagePath || imagePath === '') return '';
  
  // Handle non-string values (like Buffer objects)
  if (typeof imagePath !== 'string') {
    return '';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // Remove 'public/' prefix if present and serve from GridFS
  const filename = imagePath.replace('public/', '').replace('uploads/', '').replace(/\\/g, '/');
  return `${API_BASE_URL}/files/${filename}`;
};

// Helper function to get profile image URL
export const getProfileImageUrl = (userId) => {
  if (!userId) return '';
  return `${API_BASE_URL}/users/${userId}/profile-image`;
};

// Helper function to get listing image URL
export const getListingImageUrl = (listingId, imageIndex) => {
  if (!listingId || imageIndex === undefined) return '';
  return `${API_BASE_URL}/properties/${listingId}/images/${imageIndex}`;
};

// Helper function to get blog image URL
export const getBlogImageUrl = (blogId, imageIndex) => {
  if (!blogId || imageIndex === undefined) return '';
  return `${API_BASE_URL}/blog/${blogId}/images/${imageIndex}`;
}; 