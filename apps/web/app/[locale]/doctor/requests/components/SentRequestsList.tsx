"use client";

import { Send, Plus } from "lucide-react";
import type { DoctorRequest } from "@doctor-contract/shared";
import { RequestCard } from "./RequestCard";

interface SentRequestsListProps {
  requests: DoctorRequest[];
  onCancel: (request: DoctorRequest) => void;
  onOpenSendModal: () => void;
}

export function SentRequestsList({
  requests,
  onCancel,
  onOpenSendModal,
}: SentRequestsListProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <Send className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
          No sent requests
        </h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
          You haven&apos;t sent any clinic connection requests yet. Search verified medical clinics and apply to expand your practice locations.
        </p>
        <button
          type="button"
          onClick={onOpenSendModal}
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Connect with a Clinic</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          type="sent"
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}
