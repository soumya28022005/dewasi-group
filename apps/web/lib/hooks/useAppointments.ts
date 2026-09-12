import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { Appointment, PatientProfile, BookingStatus, AppointmentLiveView } from "@doctor-contract/shared";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";

export function useMyAppointments() {
  const queryClient = useQueryClient();
  const query = useQuery<Appointment[]>({
    queryKey: ["appointments", "me"],
    queryFn: async () => {
      const { data } = await api.get("/appointments/me");
      return data.data.appointments;
    },
  });

  // Live updates for "patients ahead" / queue position — join the queue
  // room for every doctor+clinic this patient currently has an active
  // (WAITING/CHECKED_IN) appointment with, and refetch this list whenever
  // that queue moves. No polling — purely push-driven.
  const activeRooms = (query.data ?? [])
    .filter((a) => a.status === "WAITING" || a.status === "CHECKED_IN")
    .map((a) => `${a.doctorId}:${a.clinicId}`)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .join(",");

  useEffect(() => {
    if (!activeRooms) return;

    const socket = getSocket();
    const rooms = activeRooms.split(",").map((r) => {
      const [doctorId, clinicId] = r.split(":");
      return { doctorId, clinicId };
    });

    function joinAll() {
      rooms.forEach((r) => socket.emit("joinQueue", r));
    }

    function refetch() {
      queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
    }

    if (!socket.connected) {
      socket.connect();
    } else {
      joinAll();
    }

    socket.on("connect", joinAll);
    socket.on("queueUpdate", refetch);
    socket.on("tokenCalled", refetch);
    socket.on("appointmentCompleted", refetch);
    socket.on("doctorDelay", refetch);

    return () => {
      rooms.forEach((r) => socket.emit("leaveQueue", r));
      socket.off("connect", joinAll);
      socket.off("queueUpdate", refetch);
      socket.off("tokenCalled", refetch);
      socket.off("appointmentCompleted", refetch);
      socket.off("doctorDelay", refetch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRooms]);

  return query;
}

export function useMyPatientProfile() {
  return useQuery<PatientProfile>({
    queryKey: ["patient", "me"],
    queryFn: async () => {
      const { data } = await api.get("/patient/me");
      return data.data.patient;
    },
  });
}

// Part 4/8: how many active slots the patient has used, and whether a
// post-cancellation booking freeze is currently active. Refetched whenever
// the appointments list changes (booking, cancelling) via query invalidation.
export function useMyBookingStatus() {
  return useQuery<BookingStatus>({
    queryKey: ["appointments", "booking-status"],
    queryFn: async () => {
      const { data } = await api.get("/appointments/me/booking-status");
      return data.data;
    },
  });
}

// Part 7: cancel an appointment. On success, invalidate both the
// appointments list and the booking-status query — cancelling can free up
// a slot AND (if it was the 3rd active one) start a 2-day restriction, so
// both need to reflect the new backend state.
export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ appointmentId, reason }: { appointmentId: string; reason?: string }) => {
      const { data } = await api.patch(`/appointments/${appointmentId}/cancel`, { reason });
      return data.data.appointment as Appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "booking-status"] });
    },
  });
}

// Part 13/21: single-appointment live queue view — fetch on open, then stay
// live via the same queue-room socket events the list view already
// subscribes to (see useMyAppointments). The backend stays the source of
// truth: every socket event just triggers a refetch, never a local patch.
export function useAppointmentLive(appointmentId: string | undefined) {
  const queryClient = useQueryClient();
  const query = useQuery<AppointmentLiveView>({
    queryKey: ["appointments", "live", appointmentId],
    queryFn: async () => {
      const { data } = await api.get(`/appointments/${appointmentId}/live`);
      return data.data;
    },
    enabled: !!appointmentId,
    refetchInterval: (q) => (q.state.data?.isYourTurn ? false : 30_000),
  });

  useEffect(() => {
    if (!appointmentId) return;
    const socket = getSocket();

    function refetch() {
      queryClient.invalidateQueries({ queryKey: ["appointments", "live", appointmentId] });
    }

    if (!socket.connected) socket.connect();
    socket.emit("joinAppointment", appointmentId);
    // Part 21: on reconnect, always re-fetch rather than trust stale state.
    socket.on("connect", refetch);
    socket.on("queueUpdate", refetch);
    socket.on("tokenCalled", refetch);
    socket.on("appointmentCompleted", refetch);
    socket.on("doctorDelay", refetch);

    return () => {
      socket.emit("leaveAppointment", appointmentId);
      socket.off("connect", refetch);
      socket.off("queueUpdate", refetch);
      socket.off("tokenCalled", refetch);
      socket.off("appointmentCompleted", refetch);
      socket.off("doctorDelay", refetch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  return query;
}

// Part 10/11: clinic/receptionist-facing filterable appointment list. The
// backend resolves clinicId from the caller's own account — filters here
// never include clinicId, so there's no way for the client to even ask for
// another clinic's data.
export function useClinicAppointments(filters: {
  doctorId?: string;
  status?: string;
  date?: string;
  patientId?: string;
}) {
  return useQuery<Appointment[]>({
    queryKey: ["appointments", "clinic", filters],
    queryFn: async () => {
      const { data } = await api.get("/appointments/clinic", { params: filters });
      return data.data.appointments;
    },
  });
}
