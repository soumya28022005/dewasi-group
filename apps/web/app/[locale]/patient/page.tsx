"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth-context";
import { useMyAppointments, useMyBookingStatus, useCancelAppointment } from "@/lib/hooks/useAppointments";
import { Link } from "@/i18n/routing";
import toast from "react-hot-toast";
import type { Appointment } from "@doctor-contract/shared";

import {
  Calendar,
  Clock,
  Users,
  Stethoscope,
  Building2,
  Sparkles,
  Award,
  Activity,
  ChevronRight,
  HeartPulse,
  Shield,
  XCircle,
  Lock,
  Radio,
} from "lucide-react";

// ============================================================
// GRADIENT BORDER CARD
// ============================================================

function GradientCard({
  children,
  className = "",
  gradient = "from-[#252a67] via-[#3b4a8f] to-[#14B8A6]",
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <div
      className={`
        rounded-[20px]
        bg-gradient-to-r
        ${gradient}
        p-[1.5px]
        shadow-[0_8px_28px_-18px_rgba(37,42,103,0.45)]
        sm:rounded-2xl
        sm:p-[2px]
        ${className}
      `}
    >
      <div className="h-full rounded-[18px] bg-white dark:bg-slate-900 sm:rounded-[14px]">
        {children}
      </div>
    </div>
  );
}

// ============================================================
// STATUS
// ============================================================

const STATUS_STYLES: Record<string, string> = {
  WAITING:
    "bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white",
  CHECKED_IN:
    "bg-gradient-to-r from-[#252a67] to-[#3b4a8f] text-white",
  ABSENT:
    "bg-gradient-to-r from-[#6b7280] to-[#9ca3af] text-white",
  COMPLETED:
    "bg-gradient-to-r from-[#059669] to-[#10b981] text-white",
  CANCELLED:
    "bg-gradient-to-r from-[#f5576c] to-[#fda085] text-white",
};

const STATUS_LABEL_KEYS: Record<string, string> = {
  WAITING: "statusWaiting",
  CHECKED_IN: "statusCheckedIn",
  ABSENT: "statusAbsent",
  COMPLETED: "statusCompleted",
  CANCELLED: "statusCancelled",
};

// ============================================================
// DOCTOR NAME
// ============================================================

function formatDoctorName(name?: string) {
  if (!name?.trim()) return "Dr. Doctor";

  const cleanName = name
    .trim()
    .replace(/^(dr\.?\s*)+/i, "")
    .trim();

  return cleanName ? `Dr. ${cleanName}` : "Dr. Doctor";
}

// ============================================================
// DASHBOARD
// ============================================================

export default function DashboardPage() {
  const { user } = useAuth();
  const t = useTranslations("Dashboard");

  const {
    data: appointments,
    isLoading,
  } = useMyAppointments();

  const { data: bookingStatus } = useMyBookingStatus();
  const cancelMutation = useCancelAppointment();

  const [activeTab, setActiveTab] = useState<"UPCOMING" | "TODAY" | "HISTORY">("UPCOMING");
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  async function confirmCancel() {
    if (!cancelTarget) return;
    try {
      await cancelMutation.mutateAsync({ appointmentId: cancelTarget.id, reason: cancelReason || undefined });
      toast.success(t("cancelSuccess"));
      setCancelTarget(null);
      setCancelReason("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t("cancelError"));
    }
  }

  // ============================================================
  // STATS
  // ============================================================

  const upcoming = (appointments ?? []).filter(
    (appointment) =>
      appointment.status === "WAITING" ||
      appointment.status === "CHECKED_IN"
  );

  const total = appointments?.length ?? 0;

  const completed = (appointments ?? []).filter(
    (appointment) =>
      appointment.status === "COMPLETED"
  ).length;

  const cancelled = (appointments ?? []).filter(
    (appointment) =>
      appointment.status === "CANCELLED"
  ).length;

  // ============================================================
  // TABS (Part 4: UPCOMING / TODAY / HISTORY) — the backend already
  // computes `bucket` per appointment (see appointment.service.js), so this
  // is a straightforward client-side filter, not re-derived business logic.
  // ============================================================

  const bucketed = useMemo(() => {
    const list = appointments ?? [];
    return {
      UPCOMING: list.filter((a) => a.bucket === "UPCOMING"),
      TODAY: list.filter((a) => a.bucket === "TODAY"),
      HISTORY: list.filter((a) => a.bucket === "HISTORY"),
    };
  }, [appointments]);

  const visibleAppointments = bucketed[activeTab];

  const isRestricted = !!bookingStatus?.bookingRestrictedUntil;
  const restrictedUntilLabel = bookingStatus?.bookingRestrictedUntil
    ? new Date(bookingStatus.bookingRestrictedUntil).toLocaleDateString()
    : null;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-4 pb-2 sm:space-y-6">

      {/* ======================================================
          HERO / PAGE HEADER
          ====================================================== */}

      <GradientCard
        gradient="from-[#252a67] via-[#3b4a8f] to-[#14B8A6]"
      >
        <div className="relative overflow-hidden p-4 sm:p-6">

          {/* Soft decorative glow */}

          <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#14B8A6]/10 blur-3xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Welcome */}

            <div className="min-w-0">

              <div className="mb-2 flex items-center gap-2">

                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#252a67] to-[#14B8A6] text-white shadow-md sm:h-8 sm:w-8">
                  <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#252a67] dark:text-[#14B8A6] sm:text-[10px] sm:tracking-[0.2em]">
                  Dashboard
                </p>

              </div>

              <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {t("welcome")}, {user?.name}
              </h1>

              <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                {t("subtitle")}
              </p>

            </div>

            {/* CTA */}

            <Link
              href="/#search"
              className="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-[#252a67]
                to-[#3b4a8f]
                px-4
                py-2.5
                text-xs
                font-bold
                text-white
                shadow-[0_8px_18px_-8px_rgba(37,42,103,0.65)]
                transition-all
                hover:-translate-y-0.5
                hover:shadow-lg
                sm:w-auto
                sm:px-5
                sm:py-2.5
                sm:text-sm
              "
            >
              <Stethoscope className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

              {t("findDoctorCta")}

              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>

          </div>
        </div>
      </GradientCard>

      {/* ======================================================
          STATS
          ====================================================== */}

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">

        {/* UPCOMING */}

        <GradientCard gradient="from-[#f59e0b] via-[#f97316] to-[#ef4444]">
          <div className="p-3.5 sm:p-4">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-white shadow-md sm:h-10 sm:w-10 sm:rounded-xl">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <p className="mt-2.5 text-xl font-bold text-slate-900 sm:mt-3 sm:text-2xl">
              {upcoming.length}
            </p>

            <p className="mt-0.5 text-[10px] font-semibold text-slate-500 sm:text-xs">
              {t("upcomingCount")}
            </p>

          </div>
        </GradientCard>

        {/* TOTAL */}

        <GradientCard gradient="from-[#252a67] via-[#3b4a8f] to-[#14B8A6]">
          <div className="p-3.5 sm:p-4">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#252a67] to-[#3b4a8f] text-white shadow-md sm:h-10 sm:w-10 sm:rounded-xl">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <p className="mt-2.5 text-xl font-bold text-slate-900 sm:mt-3 sm:text-2xl">
              {total}
            </p>

            <p className="mt-0.5 text-[10px] font-semibold text-slate-500 sm:text-xs">
              {t("totalCount")}
            </p>

          </div>
        </GradientCard>

        {/* COMPLETED */}

        <GradientCard gradient="from-[#059669] via-[#10b981] to-[#34d399]">
          <div className="p-3.5 sm:p-4">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#059669] to-[#10b981] text-white shadow-md sm:h-10 sm:w-10 sm:rounded-xl">
              <Award className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <p className="mt-2.5 text-xl font-bold text-slate-900 sm:mt-3 sm:text-2xl">
              {completed}
            </p>

            <p className="mt-0.5 text-[10px] font-semibold text-slate-500 sm:text-xs">
              Completed
            </p>

          </div>
        </GradientCard>

        {/* CANCELLED */}

        <GradientCard gradient="from-[#f5576c] via-[#f093fb] to-[#fda085]">
          <div className="p-3.5 sm:p-4">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#f5576c] to-[#fda085] text-white shadow-md sm:h-10 sm:w-10 sm:rounded-xl">
              <HeartPulse className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <p className="mt-2.5 text-xl font-bold text-slate-900 sm:mt-3 sm:text-2xl">
              {cancelled}
            </p>

            <p className="mt-0.5 text-[10px] font-semibold text-slate-500 sm:text-xs">
              Cancelled
            </p>

          </div>
        </GradientCard>

      </div>

      {/* ======================================================
          BOOKING RESTRICTION BANNER (Part 8)
          ====================================================== */}

      {isRestricted && (
        <GradientCard gradient="from-[#f59e0b] via-[#f97316] to-[#ef4444]">
          <div className="flex items-start gap-3 p-3.5 sm:p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-white shadow-md">
              <Lock className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 sm:text-sm">
                {t("bookingRestrictedTitle")}
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 sm:text-xs">
                {t("bookingRestrictedBody", { date: restrictedUntilLabel ?? "" })}
              </p>
            </div>
          </div>
        </GradientCard>
      )}

      {/* ======================================================
          APPOINTMENTS
          ====================================================== */}

      <section className="space-y-3.5 sm:space-y-4">

        {/* Section title + active-slot usage */}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#252a67] to-[#14B8A6] text-white shadow-md">
              <Calendar className="h-4 w-4" />
            </div>

            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              {t("myAppointments")}
            </h2>

          </div>

          {bookingStatus && (
            <span className="text-[10px] font-semibold text-slate-500 sm:text-xs">
              {t("activeAppointmentsUsed", {
                used: bookingStatus.activeAppointments,
                max: bookingStatus.maxActiveAppointments,
              })}
            </span>
          )}
        </div>

        {/* Tabs — Part 4: UPCOMING / TODAY / HISTORY */}

        <div className="flex gap-1.5 rounded-xl bg-slate-100 p-1 sm:gap-2 sm:p-1.5">
          {(["UPCOMING", "TODAY", "HISTORY"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg px-2 py-2 text-[11px] font-bold transition sm:text-sm ${
                activeTab === tab
                  ? "bg-white text-[#252a67] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t(tab === "UPCOMING" ? "tabUpcoming" : tab === "TODAY" ? "tabToday" : "tabHistory")}
              <span className="ml-1 text-[10px] font-semibold text-slate-400">
                ({bucketed[tab].length})
              </span>
            </button>
          ))}
        </div>

        {/* ====================================================
            LOADING
            ==================================================== */}

        {isLoading && (
          <div className="flex min-h-[180px] items-center justify-center rounded-[20px] border border-slate-100 bg-slate-50/60 sm:min-h-[200px] sm:rounded-3xl">

            <div className="flex flex-col items-center gap-3">

              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#252a67] border-t-transparent" />

              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                {t("loadingAppointments")}
              </p>

            </div>

          </div>
        )}

        {/* ====================================================
            EMPTY (no appointments at all)
            ==================================================== */}

        {!isLoading &&
          appointments?.length === 0 && (
            <GradientCard gradient="from-[#252a67] via-[#3b4a8f] to-[#14B8A6]">

              <div className="px-5 py-8 text-center sm:p-10">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#252a67] to-[#14B8A6] text-white shadow-md sm:h-14 sm:w-14 sm:rounded-2xl">

                  <Calendar className="h-6 w-6 sm:h-7 sm:w-7" />

                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-800 sm:mt-4 sm:text-base">
                  {t("noAppointments")}
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-[11px] leading-relaxed text-slate-500 sm:text-xs">
                  {t("noAppointmentsDesc")}
                </p>

                <Link
                  href="/#search"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#252a67] to-[#3b4a8f] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 sm:mt-5 sm:px-5 sm:text-sm"
                >
                  <Stethoscope className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

                  {t("noAppointmentsCta")}

                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>

              </div>

            </GradientCard>
          )}

        {/* ====================================================
            EMPTY (this tab has nothing, but other tabs might)
            ==================================================== */}

        {!isLoading &&
          (appointments?.length ?? 0) > 0 &&
          visibleAppointments.length === 0 && (
            <div className="rounded-[20px] border border-slate-100 bg-slate-50/60 px-5 py-8 text-center sm:rounded-3xl sm:p-10">
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                {t(activeTab === "UPCOMING" ? "noUpcoming" : activeTab === "TODAY" ? "noToday" : "noHistory")}
              </p>
            </div>
          )}

        {/* ====================================================
            APPOINTMENT CARDS
            ==================================================== */}

        {visibleAppointments.map((appt) => {

          const doctorName = formatDoctorName(
            appt.doctor?.user?.name
          );

          const appointmentDate =
            new Date(appt.date).toLocaleDateString();

          const statusStyle =
            STATUS_STYLES[appt.status] ??
            STATUS_STYLES.WAITING;

          const statusLabel =
            t(
              STATUS_LABEL_KEYS[appt.status] ??
                "statusWaiting"
            );

          const isActive = appt.status === "WAITING" || appt.status === "CHECKED_IN";
          const canCancel = appt.status === "WAITING";

          return (
            <GradientCard
              key={appt.id}
              gradient={appt.isYourTurn ? "from-[#059669] via-[#10b981] to-[#34d399]" : "from-[#252a67] via-[#3b4a8f] to-[#14B8A6]"}
            >

              <div className="p-3.5 sm:p-5">

                {/* ==================================================
                    TOP
                    ================================================== */}

                <div className="flex items-start gap-3">

                  {/* Doctor icon */}

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#252a67] to-[#14B8A6] text-white shadow-md sm:h-12 sm:w-12">
                    <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>

                  {/* Doctor information */}

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-bold text-slate-900 sm:text-base">
                      {doctorName}
                    </p>

                    <p className="mt-1 flex min-w-0 items-center gap-1 text-[11px] text-slate-500 sm:text-sm">

                      <Building2 className="h-3 w-3 shrink-0 text-[#14B8A6] sm:h-3.5 sm:w-3.5" />

                      <span className="truncate">
                        {appt.clinic?.clinicName}
                      </span>

                    </p>

                    <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 sm:text-sm">

                      <Calendar className="h-3 w-3 shrink-0 text-[#14B8A6] sm:h-3.5 sm:w-3.5" />

                      {appointmentDate}

                    </p>

                  </div>

                  {/* Status */}

                  <span
                    className={`
                      inline-flex
                      shrink-0
                      items-center
                      gap-1
                      rounded-full
                      px-2
                      py-1
                      text-[9px]
                      font-bold
                      shadow-sm
                      sm:px-3
                      sm:py-1.5
                      sm:text-xs
                      ${statusStyle}
                    `}
                  >
                    <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />

                    <span className="hidden min-[380px]:inline">
                      {statusLabel}
                    </span>

                    <span className="min-[380px]:hidden">
                      {appt.status === "WAITING"
                        ? "Wait"
                        : appt.status === "CHECKED_IN"
                          ? "In"
                          : appt.status === "COMPLETED"
                            ? "Done"
                            : appt.status === "CANCELLED"
                              ? "Cancel"
                              : "Absent"}
                    </span>
                  </span>

                </div>

                {/* ==================================================
                    APPOINTMENT META
                    ================================================== */}

                <div className="mt-3 flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-3 sm:mt-4 sm:gap-4 sm:pt-4">

                  {/* Token */}

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#252a67] to-[#3b4a8f] px-2.5 py-1.5 text-[10px] font-bold text-white shadow-sm sm:px-3 sm:text-xs">

                    <Award className="h-3 w-3 sm:h-3.5 sm:w-3.5" />

                    {t("token")} #{appt.token}

                  </span>

                  {/* Live queue information (Part 13-19) */}

                  {appt.queueMode === "PRIVATE" ? (

                    <span className="text-[10px] font-medium text-slate-400 sm:text-xs">
                      {t("privateQueue")}
                    </span>

                  ) : (
                    isActive && appt.queue?.currentToken != null && (
                      appt.isYourTurn ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#059669] to-[#10b981] px-2.5 py-1.5 text-[10px] font-bold text-white shadow-sm sm:px-3 sm:text-xs">
                          <Radio className="h-3 w-3 animate-pulse sm:h-3.5 sm:w-3.5" />
                          {t("yourTurn")}
                        </span>
                      ) : (
                        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-slate-500 sm:text-xs">

                          <span className="flex items-center gap-1">
                            <Activity className="h-3.5 w-3.5 shrink-0 text-[#252a67]" />
                            {t("currentlyServing")} #{appt.queue.currentToken}
                          </span>

                          <span className="flex items-center gap-1">

                            <Users className="h-3.5 w-3.5 shrink-0 text-[#14B8A6]" />

                            {appt.patientsAhead}{" "}
                            {t("patientsAhead")}

                          </span>

                          {appt.estimatedWaitLabel && (
                            <span className="flex items-center gap-1">

                              <Clock className="h-3.5 w-3.5 shrink-0 text-[#f59e0b]" />

                              {t("estimatedWait")}: {appt.estimatedWaitLabel}

                            </span>
                          )}

                        </div>
                      )
                    )
                  )}

                  {/* Cancel action (Part 7) */}

                  {canCancel && (
                    <button
                      onClick={() => setCancelTarget(appt)}
                      className="ml-auto inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-[10px] font-bold text-red-600 transition hover:bg-red-50 sm:px-3 sm:text-xs"
                    >
                      <XCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {t("cancelAppointment")}
                    </button>
                  )}

                </div>

              </div>
            </GradientCard>
          );
        })}

      </section>

      {/* ======================================================
          CANCEL CONFIRMATION MODAL
          ====================================================== */}

      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
              {t("cancelConfirmTitle")}
            </h3>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500 sm:text-xs">
              {t("cancelConfirmBody")}
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder={t("cancelReasonPlaceholder")}
              rows={2}
              className="mt-3 w-full resize-none rounded-lg border border-slate-200 p-2 text-xs outline-none focus:border-[#252a67] dark:border-slate-700 dark:bg-slate-800"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setCancelTarget(null);
                  setCancelReason("");
                }}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                {t("cancelKeep")}
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancelMutation.isPending}
                className="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
              >
                {cancelMutation.isPending ? t("cancelling") : t("cancelSubmit")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}