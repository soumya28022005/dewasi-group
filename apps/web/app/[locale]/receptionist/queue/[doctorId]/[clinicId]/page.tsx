"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

import { useMyAssignedDoctors } from "@/lib/hooks/useReceptionist";
import { useDoctorQueue } from "@/lib/hooks/useDoctor";
import { QueueHeader } from "../../../../doctor/queue/components/QueueHeader";
import { QueueStatusCard } from "../../../../doctor/queue/components/QueueStatusCard";
import { CurrentPatientCard } from "../../../../doctor/queue/components/CurrentPatientCard";
import { QueueActions } from "../../../../doctor/queue/components/QueueActions";
import { QueueList } from "../../../../doctor/queue/components/QueueList";
import { QueueSkeleton } from "../../../../doctor/queue/components/QueueSkeleton";
import { QueueError } from "../../../../doctor/queue/components/QueueError";

export default function ReceptionistDoctorQueuePage() {
  const params = useParams<{ doctorId: string; clinicId: string }>();
  const doctorId = params.doctorId;
  const clinicId = params.clinicId;

  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayDate);

  const { data: doctors, isLoading: loadingDoctors } = useMyAssignedDoctors();
  const doctor = doctors?.find((d) => d.id === doctorId && d.clinic?.id === clinicId);

  const {
    data: queue,
    isLoading: loadingQueue,
    isFetching: fetchingQueue,
    isError: isErrorQueue,
    error: queueError,
    refetch: refetchQueue,
  } = useDoctorQueue(doctorId, clinicId, selectedDate);

  if (loadingDoctors || loadingQueue) {
    return <QueueSkeleton />;
  }

  if (isErrorQueue) {
    const errorMsg = queueError instanceof Error ? queueError.message : undefined;
    return <QueueError onRetry={() => refetchQueue()} message={errorMsg} />;
  }

  const currentPatientToken = queue?.tokens?.find((t) => t.token === queue.currentToken);
  const waitingTokens = (queue?.tokens ?? []).filter(
    (t) => t.status === "WAITING" || t.status === "CHECKED_IN"
  );

  // Single-entry "clinics" list so QueueHeader's selector just shows this
  // doctor's context — the real doctor switch happens via the back link.
  const clinicOption = [
    {
      id: clinicId,
      name: doctor
        ? `${doctor.user.name}${doctor.clinic?.clinicName ? ` — ${doctor.clinic.clinicName}` : ""}`
        : "Queue",
      address: doctor?.clinic?.address ?? null,
    },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/receptionist/queue"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[var(--color-primary-text)] dark:text-ink-500"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to doctor list
      </Link>

      <QueueHeader
        clinics={clinicOption}
        selectedClinicId={clinicId}
        onClinicChange={() => {}}
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
            clinicId={clinicId}
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