"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Save, Loader2, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useCenterWorkingHours, useUpdateCenterWorkingHours } from "@/lib/hooks/useDiagnosticCenter";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

export default function CenterSchedulePage() {
  const { data: workingHours, isLoading } = useCenterWorkingHours();
  const updateMutation = useUpdateCenterWorkingHours();

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: { hours: [] as any[] }
  });

  const { fields } = useFieldArray({ control, name: "hours" });

  useEffect(() => {
    if (workingHours) {
      const formatted = DAYS.map(day => {
        const existing = workingHours.find((h: any) => h.dayOfWeek === day);
        return {
          dayOfWeek: day,
          openTime: existing?.openTime || "09:00",
          closeTime: existing?.closeTime || "17:00",
          isClosed: existing?.isClosed ?? false,
        };
      });
      reset({ hours: formatted });
    }
  }, [workingHours, reset]);

  const onSubmit = async (data: any) => {
    try {
      await updateMutation.mutateAsync(data.hours);
      toast.success("Schedule updated successfully!");
    } catch (error) {
      toast.error("Failed to update schedule.");
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Working Hours</h1>
        <p className="text-sm text-slate-500">Set your daily opening and closing times.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-4">
          {fields.map((field: any, index) => (
            <div key={field.id} className="flex items-center gap-4 rounded-lg border p-4 dark:border-slate-800">
              <div className="w-32 font-medium text-slate-700 dark:text-slate-300">
                {field.dayOfWeek}
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register(`hours.${index}.isClosed`)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-rose-600">Closed</label>
              </div>

              <div className="flex flex-1 items-center justify-end gap-3">
                <input
                  type="time"
                  {...register(`hours.${index}.openTime`)}
                  className="rounded-lg border px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="time"
                  {...register(`hours.${index}.closeTime`)}
                  className="rounded-lg border px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Schedule
          </button>
        </div>
      </form>
    </div>
  );
}