"use client";

import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { usePublicCenterDetails } from "@/lib/hooks/useDiagnosticCenter";
import { useAuth } from "@/lib/auth-context"; // আপনার Auth Context
import { 
  MapPin, Phone, MessageCircle, Navigation, 
  Wifi, WifiOff, FileText, CheckCircle2, ShieldCheck, Loader2 
} from "lucide-react";
import toast from "react-hot-toast";

export default function PublicLabDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const centerId = params.id as string;
  
  // Auth context থেকে ইউজার নিচ্ছি
  const { user } = useAuth();
  
  // পাবলিক API কল
  const { data, isLoading, error } = usePublicCenterDetails(centerId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !data?.center) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-slate-500">
        <h2 className="text-2xl font-bold">Lab Not Found</h2>
        <p>The diagnostic center you are looking for does not exist.</p>
      </div>
    );
  }

  const { center, tests } = data;

  // Contact Handlers
  const handleWhatsApp = () => {
    if (center.whatsapp) {
      window.open(`https://wa.me/${center.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
    }
  };

  const handleCall = () => {
    if (center.phone) {
      window.open(`tel:${center.phone}`, '_self');
    }
  };

  const handleMap = () => {
    if (center.googleMapsUrl) {
      window.open(center.googleMapsUrl, '_blank');
    } else if (center.latitude && center.longitude) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${center.latitude},${center.longitude}`, '_blank');
    } else {
      toast.error("Location map is not available for this lab.");
    }
  };

  // Booking Handler (লগইন চেক)
  const handleBookTest = (testName: string) => {
    if (!user) {
      toast.error("Please login to book a test.");
      router.push("/login");
      return;
    }
    // লগইন থাকলে বুকিং পেজে বা মডালে নিয়ে যাবে
    toast.success(`Proceeding to book: ${testName}`);
    // router.push(`/book?centerId=${center.id}&test=${testName}`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* === 1. Lab Header & Info === */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 p-6 sm:p-8 dark:border-slate-800">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                  {center.centerName}
                </h1>
                {center.isApproved && (
                  <ShieldCheck className="h-6 w-6 text-blue-500" />
                )}
              </div>

              {/* Online / Offline Status */}
              <div className="mt-3 flex items-center gap-2">
                {center.isOnline ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </span>
                    Currently Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <WifiOff className="h-3 w-3" /> Offline
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{center.address}, {center.city}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {center.whatsapp && (
                <button onClick={handleWhatsApp} className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </button>
              )}
              {center.phone && (
                <button onClick={handleCall} className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                  <Phone className="h-4 w-4" /> Call
                </button>
              )}
              <button onClick={handleMap} className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                <Navigation className="h-4 w-4" /> Map
              </button>
            </div>
          </div>

          {/* Authorization Note */}
          {center.authorizationNote && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-500">Authorization Note</h4>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-400/80">
                  {center.authorizationNote}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === 2. Tests & Pricing === */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Available Tests & Pricing</h2>
        
        {tests.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            No tests are currently listed for this center.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tests.map((ct: any) => (
              <div key={ct.id} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {ct.diagnosticTest?.name}
                    </h3>
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  </div>
                  {ct.diagnosticTest?.description && (
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2 dark:text-slate-400">
                      {ct.diagnosticTest.description}
                    </p>
                  )}
                </div>
                
                <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Price</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ৳ {ct.price.toFixed(2)}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleBookTest(ct.diagnosticTest?.name)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}