import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface UseRealTimeDataOptions {
  table: string;
  queryKey: string[];
  fetchFn: () => Promise<any>;
  filter?: Record<string, any>;
}

export function useRealTimeData({
  table,
  queryKey,
  fetchFn,
  filter = {},
}: UseRealTimeDataOptions) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to real-time changes
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          ...filter,
        },
        () => {
          // Invalidate and refetch data when changes occur
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      // Cleanup subscription
      supabase.removeChannel(channel);
    };
  }, [table, queryKey.join(',')]);

  // Use React Query for data fetching
  return useQuery({
    queryKey,
    queryFn: fetchFn,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60, // Consider data stale after 1 minute
  });
}

// Example usage hooks
export function useAppointments() {
  return useRealTimeData({
    table: 'appointments',
    queryKey: ['appointments'],
    fetchFn: async () => {
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });
      return data;
    },
  });
}

export function usePatients() {
  return useRealTimeData({
    table: 'patients',
    queryKey: ['patients'],
    fetchFn: async () => {
      const { data } = await supabase
        .from('patients')
        .select('*')
        .order('name', { ascending: true });
      return data;
    },
  });
}

export function usePayments() {
  return useRealTimeData({
    table: 'payments',
    queryKey: ['payments'],
    fetchFn: async () => {
      const { data } = await supabase
        .from('payments')
        .select(`
          *,
          patients (name, email),
          appointments (
            appointment_type,
            date,
            time
          )
        `)
        .order('created_at', { ascending: false });
      return data;
    },
  });
}

export function usePatientAppointments(patientId: string) {
  return useRealTimeData({
    table: 'appointments',
    queryKey: ['appointments', patientId],
    fetchFn: async () => {
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false });
      return data;
    },
    filter: { patient_id: patientId },
  });
}

export function usePatientPayments(patientId: string) {
  return useRealTimeData({
    table: 'payments',
    queryKey: ['payments', patientId],
    fetchFn: async () => {
      const { data } = await supabase
        .from('payments')
        .select(`
          *,
          appointments (
            appointment_type,
            date,
            time
          )
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });
      return data;
    },
    filter: { patient_id: patientId },
  });
} 