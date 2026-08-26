"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Megaphone,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  XCircle,
  Send,
  Siren,
  Wrench,
  CalendarOff,
  DoorClosed,
  UserX,
  Info,
} from "lucide-react";

import {
  useAdminAnnouncements,
  usePublishPlatformAnnouncement,
  useDeactivateAnnouncement,
} from "@/lib/hooks/useAnnouncements";
import type { AnnouncementType } from "@doctor-contract/shared";
import { GradientCard } from "@/components/ui/GradientCard";

function getErrorMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === "object" &&
    "response" in err &&
    err.response &&
    typeof err.response === "object" &&
    "data" in err.response &&
    err.response.data &&
    typeof err.response.data === "object" &&
    "message" in err.response.data &&
    typeof err.response.data.message === "string"
  ) {
    return err.response.data.message;
  }
  return fallback;
}

const TYPE_OPTIONS: { value: AnnouncementType; icon: typeof Info }[] = [
  { value: "GENERAL", icon: Info },
  { value: "EMERGENCY", icon: Siren },
  { value: "MAINTENANCE", icon: Wrench },
  { value: "HOLIDAY", icon: CalendarOff },
  { value: "CLINIC_CLOSED", icon: DoorClosed },
  { value: "DOCTOR_ABSENT", icon: UserX },
];

const TYPE_STYLES: Record<AnnouncementType, string> = {
  GENERAL: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  EMERGENCY: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
  MAINTENANCE: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  HOLIDAY: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300",
  CLINIC_CLOSED: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
  DOCTOR_ABSENT: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
};

export default function AdminAnnouncementsPage() {
  const t = useTranslations("AdminAnnouncements");
  const { data, isLoading, isError, isFetching, refetch } = useAdminAnnouncements();
  const publish = usePublishPlatformAnnouncement();
  const deactivate = useDeactivateAnnouncement();

  const announcements = data ?? [];

  const [type, setType] = useState<AnnouncementType>("GENERAL");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    if (!title.trim() || !message.trim()) {
      setActionError(t("validationRequired") || "Title and message are required.");
      return;
    }

    try {
      await publish.mutateAsync({ type, title: title.trim(), message: message.trim() });
      setActionSuccess(t("successPublished") || "Announcement published.");
      setTitle("");
      setMessage("");
      setType("GENERAL");
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, "Failed to publish announcement"));
    }
  }

  async function handleDeactivate(announcementId: string) {
    setActionError(null);
    setActionSuccess(null);
    setPendingId(announcementId);

    try {
      await deactivate.mutateAsync(announcementId);
      setActionSuccess(t("successDeactivated") || "Announcement deactivated.");
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, "Failed to deactivate announcement"));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header - Indigo */}
      <GradientCard variant="indigo">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {t("title") || "Platform Announcements"}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {t("subtitle") || "Broadcast a notice to every user on the platform, live via Socket.io."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-indigo-600" : ""}`} />
            <span>{t("retry") || "Refresh"}</span>
          </button>
        </div>
      </GradientCard>

      {/* Publish Form */}
      <GradientCard variant="indigo">
        <form onSubmit={handlePublish} className="space-y-4 p-5">
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t("typeLabel") || "Type"}
            </label>
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                    type === value
                      ? "border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t(`type_${value}`) || value.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t("titleLabel") || "Title"}
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("titlePlaceholder") || "e.g. Scheduled maintenance tonight"}
              maxLength={120}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t("messageLabel") || "Message"}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("messagePlaceholder") || "Details for the announcement..."}
              rows={3}
              maxLength={500}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={publish.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {publish.isPending ? t("publishing") || "Publishing..." : t("publish") || "Publish Announcement"}
          </button>
        </form>
      </GradientCard>

      {/* Alerts */}
      {actionError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{actionError}</span>
          </div>
          <button type="button" onClick={() => setActionError(null)} className="text-[11px] font-bold underline">
            {t("dismiss") || "Dismiss"}
          </button>
        </div>
      )}

      {actionSuccess && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button type="button" onClick={() => setActionSuccess(null)} className="text-[11px] font-bold underline">
            {t("dismiss") || "Dismiss"}
          </button>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <div className="flex-1">
              <h3 className="text-xs font-semibold">{t("errorTitle") || "Could not load announcements"}</h3>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-700"
            >
              {t("retry") || "Retry"}
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      )}

      {/* List */}
      {!isLoading && !isError && (
        <div className="space-y-3">
          {announcements.length === 0 ? (
            <GradientCard variant="indigo">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 shadow-xs">
                  <Megaphone className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t("emptyTitle") || "No announcements published yet"}
                </h3>
              </div>
            </GradientCard>
          ) : (
            announcements.map((a) => (
              <GradientCard key={a.id} variant="indigo">
                <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${TYPE_STYLES[a.type]}`}
                      >
                        {t(`type_${a.type}`) || a.type.replace("_", " ")}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                          a.isActive
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {a.isActive ? t("active") || "Active" : t("inactive") || "Inactive"}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{a.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{a.message}</p>
                  </div>

                  {a.isActive && (
                    <button
                      type="button"
                      onClick={() => handleDeactivate(a.id)}
                      disabled={pendingId === a.id}
                      className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 hover:scale-105 active:scale-95 disabled:opacity-50 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      {pendingId === a.id ? t("deactivating") || "Deactivating..." : t("deactivate") || "Deactivate"}
                    </button>
                  )}
                </div>
              </GradientCard>
            ))
          )}
        </div>
      )}
    </div>
  );
}