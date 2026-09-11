"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Upload,
  Building2,
  Check,
  AlertCircle,
  Loader2,
  ImagePlus,
  Sparkles,
  Camera,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useUploadDiagnosticCenterLogo } from "@/lib/hooks/useDiagnosticCenter";

interface LogoUploaderProps {
  currentLogo: string | null | undefined;
  centerName: string | undefined;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function LogoUploader({ currentLogo, centerName }: LogoUploaderProps) {
  const t = useTranslations("DiagnosticCenterProfile");

  const uploadLogo = useUploadDiagnosticCenterLogo();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /* ============================================================
     CLEANUP OBJECT URL
  ============================================================ */

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  /* ============================================================
     FILE CHANGE
  ============================================================ */

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    if (!file.type.startsWith("image/")) {
      setErrorMessage(t("invalidTypeError"));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(t("maxSizeError"));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      await uploadLogo.mutateAsync(file);
      setSuccessMessage(t("uploadSuccess"));
      toast.success(t("uploadSuccess"));
    } catch (err: any) {
      const msg = err?.response?.data?.message || t("uploadError");
      setErrorMessage(msg);
      toast.error(msg);
      setPreviewUrl(null);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const displayLogo = previewUrl || currentLogo;

  return (
    <section className="group relative rounded-3xl bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] p-[3px] shadow-[0_8px_30px_-12px_rgba(37,42,103,0.35)] transition-all duration-300 hover:shadow-[0_16px_50px_-12px_rgba(37,42,103,0.45)]">
      <div className="relative overflow-hidden rounded-[calc(1.5rem-3px)] bg-white dark:bg-slate-900">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/[0.05] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-teal-500/[0.05] blur-3xl" />

        <div className="relative p-5 sm:p-6 lg:p-7">
          {/* ======================================================
              HEADER
          ====================================================== */}

          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] shadow-sm">
              <Camera className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-[#14B8A6]" />
                <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#252a67] dark:text-teal-400">
                  Branding
                </span>
              </div>
              <h2 className="mt-0.5 text-base font-black tracking-tight text-slate-900 dark:text-white sm:text-lg">
                Center Logo
              </h2>
            </div>
          </div>

          {/* ======================================================
              MAIN AREA
          ====================================================== */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* ==================================================
                LOGO PREVIEW + DESCRIPTION
            ================================================== */}

            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              {/* Logo Preview */}
              <div className="relative h-[88px] w-[88px] shrink-0 sm:h-[96px] sm:w-[96px]">
                {/* Outer gradient frame */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] p-[2px] shadow-md">
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[calc(1rem-2px)] bg-white dark:bg-slate-900">
                    {displayLogo ? (
                      <Image
                        src={displayLogo}
                        alt={centerName || "Diagnostic Center Logo"}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                        <Building2 className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                      </div>
                    )}

                    {/* Upload Loading Overlay */}
                    {uploadLogo.isPending && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-[2px]">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                        <span className="mt-1 text-[7px] font-bold uppercase tracking-wider text-white/90">
                          {t("uploading")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Camera indicator badge */}
                {!uploadLogo.isPending && (
                  <div className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-white bg-gradient-to-br from-[#252a67] to-[#3b4a8f] shadow-md dark:border-slate-900">
                    <ImagePlus className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-base">
                  {t("logoTitle")}
                </h3>

                <p className="mt-1 max-w-lg text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400 sm:text-xs">
                  {t("logoDesc")}
                </p>

                {/* File format badges */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    PNG
                  </span>
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    JPG
                  </span>
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    WEBP
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-teal-200 bg-teal-50 px-1.5 py-0.5 text-[9px] font-bold text-teal-700 dark:border-teal-900/40 dark:bg-teal-950/30 dark:text-teal-400">
                    <Check className="h-2.5 w-2.5" />
                    Max 5 MB
                  </span>
                </div>
              </div>
            </div>

            {/* ==================================================
                UPLOAD BUTTON
            ================================================== */}

            <div className="shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploadLogo.isPending}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLogo.isPending}
                className="group/btn inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#252a67] via-[#3b4a8f] to-[#14B8A6] px-5 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-md shadow-[#252a67]/25 transition-all duration-200 hover:shadow-lg hover:shadow-[#252a67]/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-md sm:w-auto"
              >
                {uploadLogo.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 transition-transform duration-200 group-hover/btn:-translate-y-0.5" />
                )}

                <span>
                  {uploadLogo.isPending
                    ? t("uploading")
                    : currentLogo
                      ? t("changeLogo")
                      : t("uploadLogo")}
                </span>
              </button>
            </div>
          </div>

          {/* ======================================================
              FEEDBACK MESSAGES
          ====================================================== */}

          {errorMessage && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-200/70 bg-gradient-to-r from-rose-50 to-red-50/60 px-4 py-3.5 dark:border-rose-900/40 dark:from-rose-950/30 dark:to-red-950/20">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/40">
                <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-rose-900 dark:text-rose-300">
                  Upload Failed
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-rose-700 dark:text-rose-400/90">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200/70 bg-gradient-to-r from-emerald-50 to-teal-50/60 px-4 py-3.5 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-teal-950/20">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300">
                  Success
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-400/90">
                  {successMessage}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}