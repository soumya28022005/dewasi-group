"use client";

import { useMemo, useState } from "react";
import { Building2 } from "lucide-react";

import { useMyAssignedDoctors } from "@/lib/hooks/useReceptionist";
import { useDoctorQueue } from "@/lib/hooks/useDoctor";
import { QueueHeader } from "../../doctor/queue/components/QueueHeader";
import { QueueStatusCard } from "../../doctor/queue/components/QueueStatusCard";
import { CurrentPatientCard } from "../../doctor/queue/components/CurrentPatientCard";
import { QueueActions } from "../../doctor/queue/components/QueueActions";
import { QueueList } from "../../doctor/queue/components/QueueList";
import { QueueSkeleton } from "../../doctor/queue/components/QueueSkeleton";
import { QueueError } from "../../doctor/queue/components/QueueError";

export default function ReceptionistQueuePage() {
  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayDate);
  const [selectedClinicId, setSelectedClinicId] = useState<string>("");

  const {
    data: doctors,
    isLoading: loadingDoctors,
    isError: isErrorDoctors,
    refetch: refetchDoctors,
  } = useMyAssignedDoctors();

  // Each assigned doctor + their clinic becomes one selectable "queue".
  // Labeled with the doctor's name since a receptionist manages several
  // doctors' queues, not several clinics for one doctor.
  const queueOptions = useMemo(() => {
    // Corrected Map generic syntax with < and >
     const map = new Map<
       string,
       { id: string; name: string; address?: string | null; doctorId: string }
     >();

     (doctors ?? []).forEach((doc) => {
       // Your existing logic here
     });

    (doctors ?? []).forEach((doc) => {
      if (!doc.clinic?.id) return;
      map.set(doc.clinic.id, {
        id: doc.clinic.id,
        name: `${doc.user.name}${doc.clinic.clinicName ? ` — ${doc.clinic.clinicName}` : ""}`,
        address: doc.clinic.address,
        doctorId: doc.id,
      });
    });

    return Array.from(map.values());
  }, [doctors]);

  const effectiveClinicId = selectedClinicId || queueOptions[0]?.id || "";

  const activeQueue = queueOptions.find((q) => q.id === effectiveClinicId);
  const doctorId = activeQueue?.doctorId || "";

  const {
    data: queue,
    isLoading: loadingQueue,
    isFetching: fetchingQueue,
    isError: isErrorQueue,
    error: queueError,
    refetch: refetchQueue,
  } = useDoctorQueue(doctorId, effectiveClinicId, selectedDate);

  if (loadingDoctors || (Boolean(effectiveClinicId) && loadingQueue)) {
    return <QueueSkeleton />;
  }

  if (queueOptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <Building2 className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
          No assigned doctors found
        </h2>
        <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
          You don&apos;t currently have any doctors assigned to you. Ask your clinic admin to
          assign you to a doctor to start managing their live queue.
        </p>
      </div>
    );
  }

  if (isErrorDoctors) {
    return (
      <QueueError
        onRetry={() => refetchDoctors()}
        message="Unable to load your assigned doctors."
      />
    );
  }

  if (isErrorQueue) {
    const errorMsg = queueError instanceof Error ? queueError.message : undefined;
    return <QueueError onRetry={() => refetchQueue()} message={errorMsg} />;
  }

  const currentPatientToken = queue?.tokens?.find((t) => t.token === queue.currentToken);
  const waitingTokens = (queue?.tokens ?? []).filter(
    (t) => t.status === "WAITING" || t.status === "CHECKED_IN"
  );

  return (
    <div className="space-y-6">
      <QueueHeader
        clinics={queueOptions}
        selectedClinicId={effectiveClinicId}
        onClinicChange={setSelectedClinicId}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        status={queue?.status}
        isFetching={fetchingQueue}
        onRefresh={() => refetchQueue()}
      />

      <QueueStatusCard queue={queue} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col lg:col-span-1">
          <CurrentPatientCard
            currentPatientToken={currentPatientToken}
            currentTokenNumber={queue?.currentToken}
          />
        </div>
        <div className="flex flex-col lg:col-span-2">
          <QueueActions
            doctorId={doctorId}
            clinicId={effectiveClinicId}
            date={selectedDate}
            queueStatus={queue?.status}
            waitingTokens={waitingTokens}
          />
        </div>
      </div>

      <QueueList tokens={queue?.tokens} currentTokenNumber={queue?.currentToken} />
    </div>
  );
}