"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { fetchMyNotifications } from "@/lib/api";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      if (typeof window === "undefined") return;

      // Prevent fetching on login/register pages to avoid 401 errors
      const pathname = window.location.pathname;
      if (pathname.includes("/login") || pathname.includes("/register")) return;

      try {
        const data = await fetchMyNotifications();
        // Fallback safety to prevent "map is not a function" crash
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error("Failed to load notifications UI:", error);
        setNotifications([]);
      }
    };
    
    loadNotifications();
  }, []);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-lg ring-1 ring-slate-200 z-50">
          <div className="p-4 border-b border-slate-100 font-semibold text-slate-800">
            Notifications
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <p className="text-sm font-medium text-slate-800">{notif.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}