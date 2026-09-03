"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { api } from "@/lib/api"; 
import { getSocket } from "@/lib/socket"; 

export default function LiveDoctorsButton() {
  const [liveCount, setLiveCount] = useState<number>(0);

  const fetchLiveDoctors = async () => {
    try {
      // FIXED: Removed the extra /api/v1 since the Axios instance already includes it
      const response = await api.get("/doctors/advanced-search?liveNow=true");
      
      if (response.data?.success) {
        setLiveCount(response.data.data.doctors.length);
      }
    } catch (error) {
      console.error("Failed to fetch live doctors count", error);
    }
  };

  useEffect(() => {
    fetchLiveDoctors();

    const socket = getSocket();

    if (socket) {
      socket.on("doctor.status.updated", fetchLiveDoctors);
      socket.on("doctor.availability.updated", fetchLiveDoctors);
      socket.on("queue.updated", fetchLiveDoctors);

      return () => {
        socket.off("doctor.status.updated", fetchLiveDoctors);
        socket.off("doctor.availability.updated", fetchLiveDoctors);
        socket.off("queue.updated", fetchLiveDoctors);
      };
    }
  }, []);

  return (
    <Link
      href="/doctors?liveNow=true"
      className="group relative flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 hover:text-red-800 dark:border-red-900/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
    >
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        {liveCount > 0 && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
      </span>
      <span>
        Live Doctors {liveCount > 0 && <span className="font-bold">({liveCount})</span>}
      </span>
    </Link>
  );
}