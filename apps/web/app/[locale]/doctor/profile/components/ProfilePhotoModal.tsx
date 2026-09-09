"use client";

import { useState, useRef, useEffect } from "react";
import { X, UploadCloud, Loader2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { uploadProfilePhoto } from "@/lib/api"; // আপনার নতুন যোগ করা API ফাংশন

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProfilePhotoModal({ isOpen, onClose, onSuccess }: ProfilePhotoModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // মডাল বন্ধ হলে স্টেট রিসেট করা
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsUploading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ফাইল টাইপ ভ্যালিডেশন
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPG, PNG)");
      return;
    }

    // সাইজ ভ্যালিডেশন (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a photo first");
      return;
    }

    setIsUploading(true);

    try {
      await uploadProfilePhoto(selectedFile);
      toast.success("Profile photo updated successfully!");
      onSuccess(); // পেজ রিফ্রেশ করবে
      onClose(); // মডাল বন্ধ করবে
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile photo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Update Profile Photo
          </h2>
          <button 
            onClick={onClose}
            disabled={isUploading}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center">
            {previewUrl ? (
              <div className="relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-indigo-50 dark:ring-indigo-500/10">
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-white opacity-0 transition-opacity hover:opacity-100"
                >
                  Change
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-indigo-500 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-indigo-400 dark:hover:bg-indigo-500/10"
              >
                <UploadCloud className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                <span className="mt-2 text-[10px] font-medium text-slate-500 dark:text-slate-400">Click to upload</span>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/jpeg, image/png, image/webp" 
              className="hidden" 
            />
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Recommended size: 500x500px.<br /> Maximum file size: 5MB.
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isUploading ? "Uploading..." : "Save Photo"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}