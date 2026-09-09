"use client";

import { Inbox, Send, Filter } from "lucide-react";
import type { DoctorRequestStatus } from "@doctor-contract/shared";
import { GradientCard } from "@/components/ui/GradientCard";

export type TabType = "received" | "sent";
export type StatusFilterType = "ALL" | DoctorRequestStatus;

interface RequestsTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  receivedCount: number;
  pendingReceivedCount: number;
  sentCount: number;
  statusFilter: StatusFilterType;
  onStatusFilterChange: (filter: StatusFilterType) => void;
}

export function RequestsTabs({
  activeTab,
  onTabChange,
  receivedCount,
  pendingReceivedCount,
  sentCount,
  statusFilter,
  onStatusFilterChange,
}: RequestsTabsProps) {
  return (
    <GradientCard variant="slate">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Primary Tab Switcher */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => onTabChange("received")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "received"
                ? "bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Inbox className="h-4 w-4" />
            <span>Received Invitations</span>
            {pendingReceivedCount > 0 ? (
              <span className="ml-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                {pendingReceivedCount}
              </span>
            ) : (
              <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                {receivedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange("sent")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "sent"
                ? "bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Send className="h-4 w-4" />
            <span>Sent Requests</span>
            <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
              {sentCount}
            </span>
          </button>
        </div>

        {/* Status Filter Dropdown / Pills */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            <span>Status:</span>
          </span>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {(["ALL", "PENDING", "ACCEPTED", "REJECTED"] as StatusFilterType[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onStatusFilterChange(status)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
                  statusFilter === status
                    ? "bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </GradientCard>
  );
}
