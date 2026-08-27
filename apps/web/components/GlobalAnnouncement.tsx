"use client";

import { useState, useEffect, useCallback } from "react";
import { Megaphone, X, ArrowRight, BellRing, ChevronLeft, ChevronRight } from "lucide-react";
import { getSocket } from "@/lib/socket"; 
import { fetchAnnouncements } from "@/lib/api"; 
import { Link } from "@/i18n/routing"; // আপনার রাউটিং সেটআপ অনুযায়ী
import toast from "react-hot-toast";

interface AnnouncementData {
  id: string;
  title: string;
  message: string;
}

export default function GlobalAnnouncement() {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const showSubtleToast = useCallback((data: AnnouncementData) => {
    toast.custom(
      (t) => (
        <div className={`${t.visible ? "animate-enter" : "animate-leave"} pointer-events-auto flex w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10`}>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
              <BellRing className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-slate-900 dark:text-white">New Announcement</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{data.title}</p>
            </div>
            <button onClick={() => toast.dismiss(t.id)} className="flex shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ), { duration: 6000 }
    );
  }, []);

  const loadAnnouncements = useCallback(async (isBackgroundCheck = false) => {
    if (typeof window === "undefined") return;
    const pathname = window.location.pathname;
    if (pathname.includes("/login") || pathname.includes("/register")) return;

    try {
      const dataList = await fetchAnnouncements();
      if (Array.isArray(dataList)) {
        setAnnouncements((prev) => {
          if (isBackgroundCheck && dataList.length > prev.length) {
            const newAnnouncements = dataList.filter(active => !prev.some(p => p.id === active.id));
            
            // FIX: React render cycle এর বাইরে টোস্ট কল করা হলো যাতে Warning না আসে
            if (newAnnouncements.length > 0) {
              setTimeout(() => {
                newAnnouncements.forEach(a => showSubtleToast(a));
              }, 0);
            }
          }
          return dataList; 
        });
      }
    } catch (error) {
      console.warn("Failed to fetch announcements:", error);
    }
  }, [showSubtleToast]);

  useEffect(() => {
    loadAnnouncements(false);
    const intervalId = setInterval(() => { loadAnnouncements(true); }, 10000); 
    return () => clearInterval(intervalId);
  }, [loadAnnouncements]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pathname = window.location.pathname;
    if (pathname.includes("/login") || pathname.includes("/register")) return;

    const socket = getSocket();
    if (!socket.connected) socket.connect();

    const handleNewAnnouncement = (data: AnnouncementData) => {
      setAnnouncements((prev) => {
        if (prev.some(a => a.id === data.id)) return prev;
        
        setTimeout(() => {
          showSubtleToast(data);
        }, 0);
        
        return [data, ...prev]; 
      });
    };

    socket.on("new_announcement", handleNewAnnouncement);
    return () => { socket.off("new_announcement", handleNewAnnouncement); };
  }, [showSubtleToast]);

  // Auto Slider Effect
  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000); // প্রতি ৫ সেকেন্ডে স্লাইড হবে
    return () => clearInterval(timer);
  }, [announcements.length]);

  const handleClose = (id: string) => {
    setAnnouncements((prev) => {
      const filtered = prev.filter(a => a.id !== id);
      if (currentIndex >= filtered.length) setCurrentIndex(Math.max(0, filtered.length - 1));
      return filtered;
    });
  };

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % announcements.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);

  if (announcements.length === 0) return null;

  const currentAnnouncement = announcements[currentIndex];

  return (
    <div className="sticky top-4 z-40 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 mt-4 mb-2">
      <div className="relative isolate flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-3 shadow-lg shadow-blue-500/20 ring-1 ring-white/20 animate-in slide-in-from-top-10 fade-in duration-700 ease-out">
        
        {/* FIX: 404 error দেওয়া noise.svg লাইনটি রিমুভ করা হয়েছে */}
        
        <div className="flex flex-1 items-center gap-x-4 w-full sm:w-auto">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-inner ring-1 ring-white/30">
            <Megaphone className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          
          <div className="flex-1 min-w-0 transition-opacity duration-500">
            <p className="text-sm font-medium text-white leading-snug">
              <strong className="font-extrabold tracking-wide text-[15px] block sm:inline">{currentAnnouncement.title}</strong>
              <span className="mx-2 hidden sm:inline opacity-60">|</span>
              <span className="opacity-95 block sm:inline mt-1 sm:mt-0 text-blue-50 truncate sm:whitespace-normal">
                {currentAnnouncement.message.length > 80 ? currentAnnouncement.message.substring(0, 80) + '...' : currentAnnouncement.message}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-none items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* Slider Controls (Only if multiple) */}
          {announcements.length > 1 && (
            <div className="flex items-center gap-1 mr-2 bg-white/10 rounded-full p-1 backdrop-blur-sm ring-1 ring-white/20">
              <button onClick={prevSlide} className="p-1 rounded-full text-white hover:bg-white/20 transition"><ChevronLeft className="h-4 w-4" /></button>
              <span className="text-[10px] font-bold text-white px-1">{currentIndex + 1} / {announcements.length}</span>
              <button onClick={nextSlide} className="p-1 rounded-full text-white hover:bg-white/20 transition"><ChevronRight className="h-4 w-4" /></button>
            </div>
          )}

          <Link 
            href="/announcements" 
            className="group flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-blue-700 shadow-sm transition-all hover:bg-blue-50 hover:scale-105 active:scale-95"
          >
            More details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <button 
            onClick={() => handleClose(currentAnnouncement.id)} 
            className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10 text-white hover:bg-red-500 transition-all backdrop-blur-sm ring-1 ring-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}