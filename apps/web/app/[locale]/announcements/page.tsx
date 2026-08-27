"use client";

import { useEffect, useState } from "react";
import { Megaphone, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { fetchAnnouncements } from "@/lib/api";
import SectionHeader from "@/components/SectionHeader";

interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt?: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAnnouncements();
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading announcements:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-12">
          <SectionHeader 
            eyebrow="Platform Updates" 
            title="Important Announcements" 
          />
          <p className="mt-2 text-center text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Stay up to date with the latest platform news, maintenance schedules, and important clinic notices.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : announcements.length === 0 ? (
          
          /* Empty State */
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
              <Megaphone className="h-10 w-10 text-blue-500 opacity-50" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">No active announcements</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              There are currently no important updates or notices. Check back later!
            </p>
          </div>
        ) : (
          
          /* Grid Layout for Announcements */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {announcements.map((announcement) => (
              <div 
                key={announcement.id} 
                className="group relative flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Decorative Glow */}
                <div className="absolute -inset-px -z-10 rounded-3xl bg-gradient-to-b from-blue-500 to-indigo-600 opacity-0 blur transition duration-500 group-hover:opacity-20"></div>
                
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 dark:bg-blue-900/20 dark:ring-blue-900/50">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  {announcement.createdAt && (
                    <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {announcement.title}
                </h3>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                  {announcement.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}