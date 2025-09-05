import { jwtDecode } from &apo:jwt-decode&apo:;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// A module-level variable to track the refresh request
let isRefreshing = false;
// A queue to hold requests that came in while the token was being refreshed
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const getAuthenticatedApi = ({ authTokens, setAuthTokens, logoutUser }) => {
  const callApi = async (url, options = {}) => {
    let currentAuthTokens = authTokens;

    if (!currentAuthTokens?.access) {
      logoutUser();
      throw new Error("Authentication token is missing. Please log in again.");
    }

    const decodedToken = jwtDecode(currentAuthTokens.access);
    const isExpired = decodedToken.exp * 1000 < Date.now();

    if (isExpired) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
            method: &apo:POST&apo:,
            headers: { &apo:Content-Type&apo:: &apo:application/json&apo: },
            body: JSON.stringify({ refresh: currentAuthTokens.refresh }),
          });

          const newTokens = await response.json();

          if (!response.ok) {
            throw new Error(newTokens.detail || &apo:Refresh token is invalid&apo:);
          }
          
          localStorage.setItem(&apo:authTokens&apo:, JSON.stringify(newTokens));
          setAuthTokens(newTokens);
          currentAuthTokens = newTokens; // Update for the current request
          processQueue(null, newTokens); // Resolve waiting requests with the new token
        } catch (refreshError) {
          processQueue(refreshError, null); // Reject waiting requests
          logoutUser();
          throw new Error(&apo:Your session has expired. Please log in again.&apo:);
        } finally {
          isRefreshing = false;
        }
      } else {
        // A refresh is already in progress, so we queue this request
        try {
          const newTokens = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          currentAuthTokens = newTokens; // Update tokens for this queued request
        } catch (error) {
          // This will be called if the original refresh request failed
          throw new Error(&apo:Session refresh failed. Please log in again.&apo:);
        }
      }
    }

    // By this point, currentAuthTokens is guaranteed to be valid.
    // All requests (original and queued) will execute this final part.
    const headers = {
      &apo:Content-Type&apo:: &apo:application/json&apo:,
      &apo:Authorization&apo:: `Bearer ${currentAuthTokens.access}`,
      ...options.headers,
    };

    const fullUrl = `${API_BASE_URL}/api${url}`;
    const response = await fetch(fullUrl, { ...options, headers });

    if (!response.ok) {
        const contentType = response.headers.get(&apo:content-type&apo:);
        const errorText = await response.text();
        
        if (response.status === 401) {
            logoutUser();
        }

        if (contentType && contentType.includes(&apo:application/json&apo:)) {
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.detail || &apo:An API error occurred.&apo:);
            } catch (e) {
                throw new Error(`Server returned an invalid response: ${errorText.slice(0, 150)}...`);
            }
        } else {
            throw new Error(`Server returned an invalid response: ${errorText.slice(0, 150)}...`);
        }
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  };

  return callApi;
};

// Corrected non-authenticated API client
export const getApi = async (url, options = {}) => {
  const headers = {
      &apo:Content-Type&apo:: &apo:application/json&apo:,
      ...options.headers,
  };

  const fullUrl = `${API_BASE_URL}/api${url}`;
  const response = await fetch(fullUrl, { ...options, headers });

  if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText.slice(0, 100)}`);
  }

  if (response.status === 204) return null;
  return response.json();
};