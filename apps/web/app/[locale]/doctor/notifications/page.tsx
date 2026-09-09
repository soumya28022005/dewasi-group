"use client";

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  useMyNotifications,
  useUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/lib/hooks/useNotifications";
import type { AppNotification } from "@doctor-contract/shared";

import { NotificationsHeader } from "./components/NotificationsHeader";
import {
  NotificationsFilterBar,
  type StatusFilter,
  type CategoryFilter,
} from "./components/NotificationsFilterBar";
import { NotificationCard } from "./components/NotificationCard";
import { NotificationsSkeleton } from "./components/NotificationsSkeleton";
import { NotificationsErrorState } from "./components/NotificationsErrorState";
import { NotificationsEmptyState } from "./components/NotificationsEmptyState";

export default function DoctorNotificationsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // API Queries & Mutations
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useMyNotifications(true);

  const { data: unreadCount = 0 } = useUnreadCount();

  const markSingleRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  // Filtered Notifications Logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n: AppNotification) => {
      // 1. Status Filter
      if (statusFilter === "UNREAD" && n.isRead) return false;
      if (statusFilter === "READ" && !n.isRead) return false;

      // 2. Category Filter
      if (categoryFilter === "REQUESTS") {
        if (n.type !== "CONNECTION_REQUEST_RECEIVED" && n.type !== "CONNECTION_REQUEST_RESPONDED") {
          return false;
        }
      } else if (categoryFilter === "APPOINTMENTS") {
        if (n.type !== "APPOINTMENT_BOOKED" && n.type !== "APPOINTMENT_CANCELLED") {
          return false;
        }
      } else if (categoryFilter === "CLINIC") {
        if (n.type !== "CLINIC_APPROVED" && n.type !== "CLINIC_REVOKED") {
          return false;
        }
      } else if (categoryFilter === "SYSTEM") {
        if (n.type !== "DOCTOR_VERIFIED" && n.type !== "GENERAL") {
          return false;
        }
      }

      // 3. Search Query
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = n.title?.toLowerCase().includes(query);
        const matchesMessage = n.message?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesMessage) return false;
      }

      return true;
    });
  }, [notifications, statusFilter, categoryFilter, searchQuery]);

  // Event Handlers
  const handleMarkSingleRead = (id: string) => {
    markSingleRead.mutate(id, {
      onSuccess: () => {
        toast.success("Notification marked as read");
      },
      onError: () => {
        toast.error("Failed to mark notification as read");
      },
    });
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return;
    markAllRead.mutate(undefined, {
      onSuccess: () => {
        toast.success("All notifications marked as read");
      },
      onError: () => {
        toast.error("Failed to mark all notifications as read");
      },
    });
  };

  const handleClearFilters = () => {
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setSearchQuery("");
  };

  if (isLoading) {
    return <NotificationsSkeleton />;
  }

  if (isError) {
    return (
      <NotificationsErrorState
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  const hasActiveFilters =
    statusFilter !== "ALL" || categoryFilter !== "ALL" || searchQuery.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <NotificationsHeader
        unreadCount={unreadCount}
        onMarkAllRead={handleMarkAllRead}
        isMarkingAll={markAllRead.isPending}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* Filter Controls */}
      <NotificationsFilterBar
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={notifications.length}
        filteredCount={filteredNotifications.length}
      />

      {/* Main Notifications List / Empty State */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkSingleRead}
              isMarkingRead={
                markSingleRead.isPending && markSingleRead.variables === notification.id
              }
            />
          ))}
        </div>
      ) : (
        <NotificationsEmptyState
          hasFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      )}
    </div>
  );
}
