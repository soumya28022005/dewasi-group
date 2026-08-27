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
  (response) => response,
  async (error) => {
    // যদি 401 Unauthorized এরর আসে (যেমন: Refresh token invalid)
    if (error.response && error.response.status === 401) {
      
      // লোকাল স্টোরেজ থেকে ইনভ্যালিড টোকেন মুছে ফেলুন
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      // ব্রাউজার যদি পাবলিক পেজে থাকে, তবে রিডাইরেক্ট করবেন না
      if (typeof window !== "undefined") {
        const publicRoutes = ["/en", "/bn", "/hi", "/login", "/register"]; // আপনার পাবলিক পেজগুলো
        const currentPath = window.location.pathname;

        const isPublicRoute = publicRoutes.some(route => currentPath === route || currentPath.startsWith(route + "/doctors") || currentPath.startsWith(route + "/clinics"));

        if (!isPublicRoute) {
          // শুধুমাত্র প্রোটেক্টেড পেজ (Admin/Doctor/Patient) হলেই লগইনে পাঠাবে
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// === Location API Calls ===

export const addSearchLocation = async (locationData: { nameEn: string; nameBn: string; nameHi: string; isActive?: boolean }) => {
  const response = await api.post('/locations', locationData);
  return response.data;
};

export const fetchSearchLocations = async () => {
  try {
    const response = await api.get('/locations');
    return response.data?.data || []; 
  } catch (error) {
    console.error("Failed to fetch locations from API:", error);
    return [];
  }
};

export const fetchAdminLocations = async () => {
  const response = await api.get('/locations/admin');
  return response.data?.data || [];
};

export const toggleSearchLocation = async (id: string, isActive: boolean) => {
  const response = await api.patch(`/locations/${id}/toggle`, { isActive });
  return response.data;
};

export const deleteSearchLocation = async (id: string) => {
  const response = await api.delete(`/locations/${id}`);
  return response.data;
};

// === Admin / Super Admin API Calls ===

// Mark or Unmark Doctor as Featured
export const setFeaturedDoctor = async (
  doctorId: string, 
  isFeatured: boolean, 
  featuredOrder: number = 0
) => {
  const response = await api.patch(`/admin/doctors/${doctorId}/featured`, {
    isFeatured,
    featuredOrder,
  });
  return response.data;
};

// Fetch All Featured Doctors
export const fetchFeaturedDoctors = async () => {
  const response = await api.get('/admin/doctors/featured');
  return response.data?.data?.doctors || [];
};

// For Admin Panel - Fetch All Doctors for dropdown
export const fetchAllDoctorsForAdmin = async () => {
  const response = await api.get('/admin/users?role=DOCTOR&limit=100');
  return response.data?.data?.users || [];
};


// --- Announcements (Public / Global) ---
export const fetchAnnouncements = async () => {
  try {
    const response = await api.get('/announcements/global');
    const data = response.data?.data?.announcements || response.data?.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return []; 
  }
};

// --- Admin Announcements Management ---

export const fetchAdminAnnouncements = async () => {
  try {
    const response = await api.get('/announcements/admin');
    const data = response.data?.data?.announcements || response.data?.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch admin announcements:", error);
    return [];
  }
};

export const updateAnnouncement = async (id: string, updateData: { title?: string; message?: string; type?: string, isActive?: boolean }) => {
  const response = await api.patch(`/announcements/admin/${id}`, updateData);
  return response.data;
};

export const deleteAnnouncement = async (id: string) => {
  const response = await api.delete(`/announcements/${id}`);
  return response.data;
};

export const deactivateAnnouncement = async (id: string) => {
  const response = await api.patch(`/announcements/${id}/deactivate`);
  return response.data;
};


// --- Notifications ---
export const fetchMyNotifications = async () => {
  try {
    const response = await api.get('/notifications/me');
    const notifs = response.data?.data?.notifications || response.data?.data || [];
    return Array.isArray(notifs) ? notifs : [];
  } catch (error) {
    return []; 
  }
};