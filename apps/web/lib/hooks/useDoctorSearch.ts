import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Doctor } from "@doctor-contract/shared";
import { api } from "@/lib/api";

export function useDoctorSearch(query: string, city?: string) {
  return useQuery<Doctor[]>({
    queryKey: ["doctors", "search", query, city ?? ""],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (query) params.doctorName = query;
      if (city) params.city = city;
      const { data } = await api.get("/appointments/doctors/search", { params });
      return data.data.doctors;
    },
  });
}

type BookPayload = { doctorId: string; clinicId: string; date: string; scheduleId?: string; };

export function useBookAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BookPayload) => {
      const { data } = await api.post("/appointments/book/online", payload);
      return data.data.appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
    },
  });
}