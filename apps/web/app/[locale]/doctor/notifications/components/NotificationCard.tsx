"use client";

import {
  CalendarCheck,
  CalendarX,
  Building2,
  AlertTriangle,
  ShieldCheck,
  Inbox,
  Send,
  Bell,
  Check,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import type { AppNotification, NotificationType } from "@doctor-contract/shared";
import { GradientCard } from "@/components/ui/GradientCard";

interface NotificationCardProps {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
  isMarkingRead?: boolean;
}

function getNotificationConfig(type: NotificationType) {
  switch (type) {
    case "APPOINTMENT_BOOKED":
      return {
        icon: CalendarCheck,
        badgeColor: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-500/30",
        iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
        label: "Appointment Booked",
        route: "/doctor/queue",
        actionText: "View Queue",
      };
    case "APPOINTMENT_CANCELLED":
      return {
        icon: CalendarX,
        badgeColor: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-400 dark:ring-rose-500/30",
        iconBg: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
        label: "Appointment Cancelled",
        route: "/doctor/queue",
        actionText: "View Queue",
      };
    case "CLINIC_APPROVED":
      return {
        icon: Building2,
        badgeColor: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-500/30",
        iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
        label: "Clinic Approved",
        route: "/doctor/clinics",
        actionText: "View Clinics",
      };
    case "CLINIC_REVOKED":
      return {
        icon: AlertTriangle,
        badgeColor: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-500/30",
        iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
        label: "Clinic Revoked",
        route: "/doctor/clinics",
        actionText: "View Clinics",
      };
    case "CONNECTION_REQUEST_RECEIVED":
      return {
        icon: Inbox,
        badgeColor: "bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-950/50 dark:text-purple-400 dark:ring-purple-500/30",
        iconBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
        label: "Clinic Request",
        route: "/doctor/requests",
        actionText: "Respond Request",
      };
    case "CONNECTION_REQUEST_RESPONDED":
      return {
        icon: Send,
        badgeColor: "bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-950/50 dark:text-indigo-400 dark:ring-indigo-500/30",
        iconBg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
        label: "Request Responded",
        route: "/doctor/requests",
        actionText: "View Requests",
      };
    case "DOCTOR_VERIFIED":
      return {
        icon: ShieldCheck,
        badgeColor: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-500/30",
        iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
        label: "Profile Verified",
        route: "/doctor/profile",
        actionText: "View Profile",
      };
    default:
      return {
        icon: Bell,
        badgeColor: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
        iconBg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        label: "System Alert",
        route: "/doctor/dashboard",
        actionText: "Dashboard",
      };
  }
}

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function NotificationCard({
  notification,
  onMarkRead,
  isMarkingRead = false,
}: NotificationCardProps) {
  const config = getNotificationConfig(notification.type);
  const IconComponent = config.icon;
  const timeAgo = formatTimeAgo(notification.createdAt);

  const cardVariant = notification.isRead ? "slate" : "blue";

  return (
    <GradientCard variant={cardVariant} borderSize="thin">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left Side: Icon & Content */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Icon Pill */}
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-xs ${config.iconBg}`}
            >
              <IconComponent className="h-4.5 w-4.5" />
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${config.badgeColor}`}
                >
                  {config.label}
                </span>

                {!notification.isRead && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                    New
                  </span>
                )}
              </div>

              <h3
                className={`text-sm font-semibold tracking-tight ${
                  notification.isRead
                    ? "text-slate-800 dark:text-slate-200"
                    : "text-slate-900 font-bold dark:text-white"
                }`}
              >
                {notification.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                {notification.message}
              </p>
            </div>
          </div>

          {/* Right Side: Timestamp & Actions */}
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </span>

            {!notification.isRead && (
              <button
                type="button"
                onClick={() => onMarkRead(notification.id)}
                disabled={isMarkingRead}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 shadow-xs hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 disabled:opacity-50 transition-colors"
                title="Mark as read"
              >
                <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <span>Mark read</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Link Banner */}
        {config.route && (
          <div className="flex items-center justify-end border-t border-slate-100 pt-2 dark:border-slate-800/80">
            <Link
              href={config.route}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <span>{config.actionText}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </GradientCard>
  );
}
