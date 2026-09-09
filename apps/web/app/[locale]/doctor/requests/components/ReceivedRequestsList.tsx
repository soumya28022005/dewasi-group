"use client";

import { Inbox, Building2 } from "lucide-react";
import type { DoctorRequest } from "@doctor-contract/shared";
import { RequestCard } from "./RequestCard";

interface ReceivedRequestsListProps {
  requests: DoctorRequest[];
  onAccept: (request: DoctorRequest) => void;
  onReject: (request: DoctorRequest) => void;
}

export function ReceivedRequestsList({
  requests,
  onAccept,
  onReject,
}: ReceivedRequestsListProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
          No received invitations
        </h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
          You currently have no incoming connection requests from clinics matching this filter. When medical clinics invite you to practice, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          type="received"
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}
    </div>
  );
}
