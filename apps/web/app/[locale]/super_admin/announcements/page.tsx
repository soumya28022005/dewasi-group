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
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
  X,
  Loader2
} from "lucide-react";

import {
  useAdminAnnouncements,
  usePublishPlatformAnnouncement,
  useDeactivateAnnouncement,
} from "@/lib/hooks/useAnnouncements";
import type { AnnouncementType } from "@doctor-contract/shared";
import { GradientCard } from "@/components/ui/GradientCard";

// API imports for Edit, Toggle, and Permanent Delete
import { deleteAnnouncement, updateAnnouncement, deactivateAnnouncement } from "@/lib/api";

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

  // Create States
  const [type, setType] = useState<AnnouncementType>("GENERAL");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Action States
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  // --- Publish Logic ---
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
      refetch(); // Reload list after publishing
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, "Failed to publish announcement"));
    }
  }

  // --- Deactivate / Reactivate (Toggle) Logic ---
  async function handleToggleStatus(announcement: any) {
    const isCurrentlyActive = announcement.isActive !== false;
    const actionWord = isCurrentlyActive ? "pause" : "re-activate";

    if (!confirm(`Are you sure you want to ${actionWord} this announcement?`)) return;
    
    setActionError(null);
    setActionSuccess(null);
    setPendingId(announcement.id);

    try {
      if (isCurrentlyActive) {
        // Pause it using your existing hook
        await deactivate.mutateAsync(announcement.id);
        setActionSuccess(t("successDeactivated") || "Announcement paused.");
      } else {
        // Re-activate it by updating the isActive flag to true
        await updateAnnouncement(announcement.id, { isActive: true });
        setActionSuccess("Announcement re-activated successfully.");
      }
      refetch(); // Refetch to update status UI instantly
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, `Failed to ${actionWord} announcement`));
    } finally {
      setPendingId(null);
    }
  }

  // --- Permanent Delete Logic ---
  async function handleDelete(announcementId: string) {
    if (!confirm("Are you sure you want to PERMANENTLY delete this announcement? This action cannot be undone.")) return;

    setActionError(null);
    setActionSuccess(null);
    setPendingId(announcementId);

    try {
      await deleteAnnouncement(announcementId);
      setActionSuccess("Announcement permanently deleted.");
      refetch(); // Refetch to remove from list instantly
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, "Failed to delete announcement"));
    } finally {
      setPendingId(null);
    }
  }

  // --- Edit Logic ---
  const handleEditClick = (announcement: any) => {
    setEditingData(announcement);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingData) return;

    setActionError(null);
    setActionSuccess(null);
    setIsSavingEdit(true);

    try {
      await updateAnnouncement(editingData.id, {
        title: editingData.title,
        message: editingData.message,
      });
      
      setActionSuccess("Announcement updated successfully.");
      setIsEditModalOpen(false);
      refetch(); // Instantly update the list
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, "Failed to update announcement"));
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="space-y-6 relative">
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
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300 animate-in fade-in">
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
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button type="button" onClick={() => setActionSuccess(null)} className="text-[11px] font-bold underline">
            {t("dismiss") || "Dismiss"}
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      )}

      {/* Announcement List */}
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
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  
                  {/* Left Side: Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${TYPE_STYLES[a.type]}`}>
                        {t(`type_${a.type}`) || a.type?.replace("_", " ") || "GENERAL"}
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                          a.isActive !== false // Assuming undefined means active
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                        }`}
                      >
                        {a.isActive !== false ? t("active") || "Live" : t("inactive") || "Paused"}
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100">{a.title}</h3>
                    <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">{a.message}</p>
                  </div>

                  {/* Right Side: Action Buttons (Pause, Edit, Delete) */}
                  <div className="flex items-center gap-2 self-start">
                    
                    {/* 1. Pause / Activate Button */}
                    <button
                      onClick={() => handleToggleStatus(a)}
                      disabled={pendingId === a.id}
                      className={`inline-flex items-center justify-center p-2 rounded-lg border transition-all disabled:opacity-50 active:scale-95 ${
                        a.isActive !== false 
                        ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-900/50"
                        : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                      }`}
                      title={a.isActive !== false ? "Pause this announcement" : "Re-activate this announcement"}
                    >
                      {pendingId === a.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : a.isActive !== false ? (
                        <PauseCircle className="h-4 w-4" />
                      ) : (
                        <PlayCircle className="h-4 w-4" />
                      )}
                    </button>

                    {/* 2. Edit Button */}
                    <button
                      onClick={() => handleEditClick(a)}
                      disabled={pendingId === a.id}
                      className="inline-flex items-center justify-center p-2 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 transition-all hover:bg-indigo-100 hover:scale-105 active:scale-95 disabled:opacity-50 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                      title="Edit Announcement"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    {/* 3. Permanent Delete Button */}
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={pendingId === a.id}
                      className="inline-flex items-center justify-center p-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition-all hover:bg-rose-100 hover:scale-105 active:scale-95 disabled:opacity-50 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/50"
                      title="Permanently Delete"
                    >
                      {pendingId === a.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>

                  </div>
                </div>
              </GradientCard>
            ))
          )}
        </div>
      )}

      {/* Edit Modal / Popup */}
      {isEditModalOpen && editingData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in zoom-in-95 duration-200">
            
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Edit Announcement
              </h2>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Announcement Title
                </label>
                <input
                  type="text"
                  required
                  value={editingData.title}
                  onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Detailed Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={editingData.message}
                  onChange={(e) => setEditingData({ ...editingData, message: e.target.value })}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSavingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}