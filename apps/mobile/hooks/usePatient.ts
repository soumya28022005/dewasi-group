import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Appointment, PatientProfile } from '../types';
import { api } from '../lib/api';

export function useMyAppointments() {
  return useQuery<Appointment[]>({
    queryKey: ['appointments', 'me'],
    queryFn: async () => {
      const { data } = await api.get('/appointments/me');
      return data?.data?.appointments ?? [];
    },
    staleTime: 30000,
  });
}

export function useMyPatientProfile() {
  return useQuery<PatientProfile>({
    queryKey: ['patient', 'me'],
    queryFn: async () => {
      const { data } = await api.get('/patient/me');
      return data?.data?.patient;
    },
    staleTime: 60000,
  });
}

export function useUpdatePatientProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.patch('/patient/me', payload);
      return data?.data?.patient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'me'] });
    },
  });
}
