import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = "Bearer " + accessToken;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    
    // Ekhane `original.url !== "/auth/refresh"` condition-ta add kora holo jate loop na hoy
    if (
      error.response?.status === 401 && 
      !original._retry && 
      original.url !== "/auth/refresh"
    ) {
      original._retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.data.accessToken);
        original.headers.Authorization = "Bearer " + data.data.accessToken;
        return api(original);
      } catch (refreshError) {
        // Refresh token fail korle token clear koro ar direct login page-e pathao
        setAccessToken(null);
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// === Location API Calls ===

// For Super Admin
export const addSearchLocation = async (locationData: { nameEn: string; nameBn: string; nameHi: string; isActive?: boolean }) => {
  // Removed /api/v1 since it is already in the baseURL
  const response = await api.post('/locations', locationData);
  return response.data;
};

// For Public Search Bar
// For Public Search Bar
export const fetchSearchLocations = async () => {
  try {
    const response = await api.get('/locations');
    // রেসপন্স থেকে সরাসরি ভেতরের ডেটা অ্যারেটি রিটার্ন করবে
    return response.data?.data || []; 
  } catch (error) {
    console.error("Failed to fetch locations from API:", error);
    return [];
  }
};

// For Admin Panel - Get All (Active + Paused)
export const fetchAdminLocations = async () => {
  const response = await api.get('/locations/admin');
  return response.data?.data || [];
};

// For Admin Panel - Toggle Status
export const toggleSearchLocation = async (id: string, isActive: boolean) => {
  const response = await api.patch(`/locations/${id}/toggle`, { isActive });
  return response.data;
};

// For Admin Panel - Delete
export const deleteSearchLocation = async (id: string) => {
  const response = await api.delete(`/locations/${id}`);
  return response.data;
};
