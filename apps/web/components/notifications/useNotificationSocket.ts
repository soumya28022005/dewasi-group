"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";
import { getSocket } from "@/lib/socket";
import type { AppNotification } from "@doctor-contract/shared";

export function useNotificationSocket() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (loading || !user?.id) {
      return;
    }

    const socket = getSocket();
    const userId = user.id;

    function handleConnect() {
      socket.emit("joinUser", userId);
    }

    function handleNewNotification(notification: AppNotification) {
      try {
        // 1. Update unread count in React Query cache
        queryClient.setQueryData<number>(
          ["notifications", "unread-count"],
          (old = 0) => old + 1
        );

        // 2. Prepend notification to existing notifications list
        queryClient.setQueryData<AppNotification[]>(
          ["notifications", "me"],
          (old = []) => {
            if (!old) return [notification];
            if (old.some((item) => item.id === notification.id)) {
              return old;
            }
            return [notification, ...old];
          }
        );

        // 3. Show notification toast if available
        if (notification.title) {
          toast(notification.title + (notification.message ? `: ${notification.message}` : ""), {
            icon: "🔔",
            duration: 4000,
          });
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[useNotificationSocket] Cache update error:", err);
        }
      }
    }

    // Connect socket if disconnected
    if (!socket.connected) {
      socket.connect();
    } else {
      // If already connected, join user room immediately
      socket.emit("joinUser", userId);
    }

    socket.on("connect", handleConnect);
    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.emit("leaveUser", userId);
      socket.off("connect", handleConnect);
      socket.off("newNotification", handleNewNotification);
    };
  }, [user?.id, loading, queryClient]);
}
