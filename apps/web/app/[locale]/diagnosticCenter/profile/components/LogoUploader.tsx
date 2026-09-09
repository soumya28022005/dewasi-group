"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Upload, Building2, Check, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useUploadDiagnosticCenterLogo } from "@/lib/hooks/useDiagnosticCenter";

interface LogoUploaderProps {
  currentLogo: string | null | undefined;
  centerName: string | undefined;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function LogoUploader({ currentLogo, centerName }: LogoUploaderProps) {
  const t = useTranslations("DiagnosticCenterProfile");
  const uploadLogo = useUploadDiagnosticCenterLogo();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate mime type
    if (!file.type.startsWith("image/")) {
      setErrorMessage(t("invalidTypeError"));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(t("maxSizeError"));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Local object URL for instant preview
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
      // Revert preview on failure
      setPreviewUrl(null);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const displayLogo = previewUrl || currentLogo;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Logo Container */}
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            {displayLogo ? (
              <Image
                src={displayLogo}
                alt={centerName || "Center Logo"}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <Building2 className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            )}

            {uploadLogo.isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t("logoTitle")}
            </h3>
            <p className="max-w-md text-xs text-slate-500 dark:text-slate-400">
              {t("logoDesc")}
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <div>
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
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {uploadLogo.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
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

      {/* Inline Feedback Alerts */}
      {errorMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
          <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
}
