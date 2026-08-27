import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Doctor, Appointment } from '../types';
import { api } from '../lib/api';

export interface BookAppointmentPayload {
  doctorId: string;
  clinicId: string;
  date: string; // ISO string with date & time
}

export function useDoctorSearch(query: string = '', city?: string) {
  return useQuery<Doctor[]>({
    queryKey: ['doctors', 'search', query, city ?? ''],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (query.trim()) params.doctorName = query.trim();
      if (city && city.trim()) params.city = city.trim();
      const { data } = await api.get('/appointments/doctors/search', { params });
      return data?.data?.doctors ?? [];
    },
    staleTime: 60000,
  });
}

export function useBookAppointment() {
  const queryClient = useQueryClient();
  return useMutation<Appointment, Error, BookAppointmentPayload>({
    mutationFn: async (payload: BookAppointmentPayload) => {
      const { data } = await api.post('/appointments/book/online', payload);
      return data?.data?.appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', 'me'] });
    },
  });
}
