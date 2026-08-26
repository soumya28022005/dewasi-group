// apps/web/lib/hooks/useSearchLocations.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useSearchLocations = () => {
  return useQuery({
    queryKey: ['searchLocations'],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/locations`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour as locations don't change often
  });
};