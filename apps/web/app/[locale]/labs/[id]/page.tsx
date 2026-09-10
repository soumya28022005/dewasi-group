"use client";

import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { usePublicCenterDetails } from "@/lib/hooks/useDiagnosticCenter";
import { useAuth } from "@/lib/auth-context";
import { 
  MapPin, Phone, MessageCircle, Navigation, 
  Wifi, WifiOff, FileText, CheckCircle2, ShieldCheck, Loader2, Building2, Home, Activity 
} from "lucide-react";
import toast from "react-hot-toast";

export default function PublicLabDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const centerId = params.id as string;
  
  const { user } = useAuth();
  
  const { data, isLoading, error } = usePublicCenterDetails(centerId);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-500 animate-pulse">Loading lab details...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.center) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-slate-500">
        <Building2 className="mb-4 h-16 w-16 text-slate-300" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Lab Not Found</h2>
        <p className="mt-2 text-slate-500">The diagnostic center you are looking for does not exist or has been removed.</p>
        <button onClick={() => router.push('/labs')} className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700">
          Browse All Labs
        </button>
      </div>
    );
  }

  const { center, tests } = data;

  // 🟢 Contact Handlers (WhatsApp Fixed)
  const handleWhatsApp = () => {
    if (center.whatsapp) {
      const cleanWa = center.whatsapp.replace(/[^0-9]/g, '');
      const waNumber = cleanWa.length === 10 ? `91${cleanWa}` : cleanWa;
      window.open(`https://wa.me/${waNumber}`, '_blank');
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

  // Booking Handler
  const handleBookTest = (testName: string) => {
    if (!user) {
      toast.error("Please login to book a test.");
      router.push("/login");
      return;
    }
    toast.success(`Proceeding to book: ${testName}`);
    // router.push(`/book?centerId=${center.id}&test=${testName}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* === 1. Premium Lab Header === */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Decorative Background Gradient */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 dark:from-blue-600/20 dark:to-cyan-500/20"></div>
        
        <div className="relative p-6 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            
            {/* Logo and Main Info */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* Logo / Image */}
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-lg sm:h-32 sm:w-32 dark:border-slate-800">
                {center.logo ? (
                  <Image 
                    src={center.logo} 
                    alt={center.centerName} 
                    fill 
                    sizes="(max-width: 768px) 96px, 128px"
                    className="object-cover" 
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-50 dark:bg-blue-900/30">
                    <Building2 className="h-12 w-12 text-blue-500 dark:text-blue-400" />
                  </div>
                )}
              </div>

              {/* Lab Details */}
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                    {center.centerName}
                  </h1>
                  {center.isApproved && (
                    <ShieldCheck className="h-7 w-7 text-blue-500" aria-label="Verified Lab" />
                  )}
                </div>

                {/* Badges */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {center.isOnline ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                      </span>
                      Available Now
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      <WifiOff className="h-3 w-3" /> Offline
                    </span>
                  )}

                  {center.hasHomeService && (
                    <span className="flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      <Home className="h-3.5 w-3.5" /> Home Sample Collection
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-start gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <p>{[center.address, center.city, center.state].filter(Boolean).join(", ")}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[200px]">
              {center.whatsapp && (
                <button onClick={handleWhatsApp} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-md shadow-green-500/20 transition hover:bg-[#20bd5a] active:scale-95">
                  <MessageCircle className="h-5 w-5" /> WhatsApp
                </button>
              )}
              {center.phone && (
                <button onClick={handleCall} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:scale-95">
                  <Phone className="h-5 w-5" /> Call Now
                </button>
              )}
              {center.googleMapsUrl && (
                <button onClick={handleMap} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700">
                  <Navigation className="h-5 w-5" /> Get Directions
                </button>
              )}
            </div>
          </div>

          {/* Authorization Note */}
          {center.authorizationNote && (
            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 dark:border-amber-900/30 dark:from-amber-900/10 dark:to-orange-900/10">
              <FileText className="mt-0.5 h-6 w-6 shrink-0 text-amber-600 dark:text-amber-500" />
              <div>
                <h4 className="font-bold text-amber-900 dark:text-amber-400">Important Note from Lab</h4>
                <p className="mt-1 text-sm font-medium text-amber-700/90 dark:text-amber-500/80">
                  {center.authorizationNote}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === 2. Tests & Pricing Section === */}
      <div className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Available Tests & Pricing</h2>
          <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {tests.length} Tests
          </span>
        </div>
        
        {tests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center dark:border-slate-700 dark:bg-slate-800/30">
            <Activity className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Tests Listed</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">This diagnostic center hasn't added any tests yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tests.map((ct: any) => (
              <div key={ct.id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900/50">
                {/* Subtle top highlight on hover */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 transition-opacity group-hover:opacity-100"></div>
                
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {ct.diagnosticTest?.name}
                    </h3>
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  </div>
                  {ct.diagnosticTest?.description && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-2 dark:text-slate-400">
                      {ct.diagnosticTest.description}
                    </p>
                  )}
                </div>
                
                <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Price</p>
                    <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                      <span className="mr-1 text-lg font-bold text-slate-400">৳</span>
                      {ct.price.toFixed(2)}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleBookTest(ct.diagnosticTest?.name)}
                    className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-600 hover:shadow-blue-600/20 active:scale-95 dark:bg-blue-600 dark:hover:bg-blue-500"
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