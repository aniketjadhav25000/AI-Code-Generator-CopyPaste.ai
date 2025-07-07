const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

/**
 * Enhanced response handler with complete error context
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const url = response.url.replace(API_BASE, '');
  
  // Handle non-JSON responses (like HTML error pages)
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    const error = new Error(
      `Expected JSON but got ${contentType || 'no content-type'}\n` +
      `URL: ${url}\n` +
      `Status: ${response.status} ${response.statusText}\n` +
      `Response: ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`
    );
    error.status = response.status;
    error.url = url;
    throw error;
  }

  const result = await response.json();
  
  if (!response.ok) {
    const error = new Error(result.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.details = result.errors || null;
    error.response = result;
    error.url = url;
    throw error;
  }
  
  return result;
};

/**
 * Enhanced request logger with timing
 */
const logRequest = (method, url, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.groupCollapsed(`API ${method} ${url}`);
    console.log('Request:', data || 'No payload');
    console.groupEnd();
  }
};

/**
 * Enhanced request handler with timeout and retries
 */
const makeRequest = async (method, url, data = null, token = null) => {
  const jwt = token || localStorage.getItem('token');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(jwt && { Authorization: `Bearer ${jwt}` }),
    },
    signal: controller.signal,
    ...(data && { body: JSON.stringify(data) }),
  };

  logRequest(method, url, data);

  try {
    const startTime = performance.now();
    const response = await fetch(`${API_BASE}${url}`, config);
    const endTime = performance.now();

    if (process.env.NODE_ENV === 'development') {
      console.log(`API ${method} ${url} - ${Math.round(endTime - startTime)}ms`);
    }

    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error(`Request timeout after 15s (${method} ${url})`);
      timeoutError.status = 408;
      throw timeoutError;
    }

    console.error(
      `API ${method} ${url} failed:`,
      error.message,
      error.response || ''
    );
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Core HTTP methods
export const apiGet = async (url, token = null) => makeRequest('GET', url, null, token);
export const apiPost = async (url, data, token = null) => makeRequest('POST', url, data, token);
export const apiPut = async (url, data, token = null) => makeRequest('PUT', url, data, token);
export const apiDelete = async (url, data = null, token = null) => makeRequest('DELETE', url, data, token);
export const apiPatch = async (url, data, token = null) => makeRequest('PATCH', url, data, token);

// Profile-specific API methods
export const apiProfile = {
  get: async (token = null) => apiGet('/user/profile', token),
  updateName: async (name, token = null) => apiPatch('/user/profile/name', { name }, token)
};

/**
 * Enhanced file upload handler with progress tracking
 */
export const apiUpload = async (url, formData, token = null, onProgress = null) => {
  const jwt = token || localStorage.getItem('token');
  const controller = new AbortController();

  const config = {
    method: 'POST',
    headers: {
      ...(jwt && { Authorization: `Bearer ${jwt}` }),
    },
    body: formData,
    signal: controller.signal,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log(`API UPLOAD: ${url}`);
  }

  try {
    const response = await fetch(`${API_BASE}${url}`, config);
    
    if (onProgress) {
      const reader = response.body.getReader();
      const contentLength = +response.headers.get('Content-Length');
      let receivedLength = 0;
      let chunks = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        onProgress(receivedLength, contentLength);
      }
    }

    return await handleResponse(response);
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

/**
 * Helper for cancellable requests
 */
export const createCancellableRequest = () => {
  const controller = new AbortController();
  
  return {
    signal: controller.signal,
    cancel: () => controller.abort(),
    get: (url, token = null) => makeRequest('GET', url, null, token, controller.signal),
    post: (url, data, token = null) => makeRequest('POST', url, data, token, controller.signal),
  };
};