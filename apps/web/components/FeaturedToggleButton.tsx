"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { setFeaturedDoctor } from "@/lib/api";

interface FeaturedToggleButtonProps {
  doctorId: string;
  initialIsFeatured: boolean;
}

export default function FeaturedToggleButton({ doctorId, initialIsFeatured }: FeaturedToggleButtonProps) {
  const [isFeatured, setIsFeatured] = useState(initialIsFeatured);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      // API Call to backend
      await setFeaturedDoctor(doctorId, !isFeatured, 0);
      setIsFeatured(!isFeatured); // Update UI if success
    } catch (error) {
      console.error("Failed to update featured status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all w-full sm:w-auto ${
        isFeatured
          ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Star className={`h-4 w-4 ${isFeatured ? "fill-amber-600 dark:fill-amber-400" : ""}`} />
      )}
      {isFeatured ? "Featured Doctor" : "Add to Featured"}
    </button>
  );
}