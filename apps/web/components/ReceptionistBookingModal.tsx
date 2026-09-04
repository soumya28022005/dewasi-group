"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Calendar, Clock, X, UserPlus, Phone, User, Loader2, Stethoscope } from "lucide-react";

export default function ReceptionistBookingModal({ 
  clinicId, 
  onClose 
}: { 
  clinicId: string; 
  onClose: () => void 
}) {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  
  const [date, setDate] = useState("");
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [isFetchingSchedules, setIsFetchingSchedules] = useState(false);

  // Patient Details (Walk-in)
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Fetch all doctors working at this clinic
  useEffect(() => {
    async function fetchClinicDoctors() {
      try {
        const res = await api.get(`/clinics/${clinicId}/doctors`);
        if (res.data?.success) setDoctors(res.data.data.doctors || []);
      } catch (err) {
        console.error("Failed to fetch doctors");
      }
    }
    fetchClinicDoctors();
  }, [clinicId]);

  // 2. THIS IS THE MAGIC: Auto-fetch valid schedules when Date or Doctor changes
  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDoctorId || !date) return;
      
      setIsFetchingSchedules(true);
      setSelectedScheduleId(""); 
      try {
        // This automatically filters Daily, Weekly, 2nd Sunday, etc. from the backend!
        const res = await api.get(`/doctors/${selectedDoctorId}/clinics/${clinicId}/schedules?date=${date}`);
        if (res.data?.success) {
          setSchedules(res.data.data.schedules || []);
        }
      } catch (err) {
        setSchedules([]);
      } finally {
        setIsFetchingSchedules(false);
      }
    }
    fetchSlots();
  }, [selectedDoctorId, date, clinicId]);

  const handleBookWalkIn = async () => {
    if (!selectedDoctorId || !selectedScheduleId || !date || !phone || !name) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }

    setIsSubmitting(true);
    try {
      // Calling the walk-in route we built in the backend
      const res = await api.post("/appointments/walk-in", {
        doctorId: selectedDoctorId,
        scheduleId: selectedScheduleId,
        phone,
        name,
        age: Number(age) || 0
      });

      setMessage({ type: "success", text: `Walk-in Booked! Token: #${res.data.data.token}` });
      setTimeout(() => onClose(), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to book." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#252a67] to-[#14B8A6] p-5 flex justify-between items-center text-white shrink-0">
          <div className="flex gap-3 items-center">
            <div className="bg-white/20 p-2 rounded-lg"><UserPlus className="h-5 w-5" /></div>
            <h3 className="font-bold text-lg">Book Walk-in Patient</h3>
          </div>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X className="h-5 w-5" /></button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Step 1: Doctor & Date */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1.5 block">Select Doctor</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus-within:border-[#14B8A6]">
                <Stethoscope className="h-4 w-4 text-[#14B8A6]" />
                <select 
                  value={selectedDoctorId} 
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold outline-none"
                >
                  <option value="">Choose...</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.user?.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 mb-1.5 block">Date</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus-within:border-[#14B8A6]">
                <Calendar className="h-4 w-4 text-[#14B8A6]" />
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => { setDate(e.target.value); setMessage(null); }}
                  className="w-full bg-transparent text-sm font-semibold outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Auto-Fetched Slots */}
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-600 mb-2 block">Available Sessions</label>
            {!date || !selectedDoctorId ? (
              <p className="text-xs text-slate-400 border border-dashed rounded-lg p-3 text-center bg-slate-50">Select a doctor and date first.</p>
            ) : isFetchingSchedules ? (
              <p className="text-xs text-[#14B8A6] font-bold flex justify-center gap-2 border rounded-lg p-3"><Loader2 className="h-4 w-4 animate-spin"/> Loading...</p>
            ) : schedules.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {schedules.map(s => {
                  const isFull = s.slotsLeft <= 0;
                  const isSelected = selectedScheduleId === s.id;
                  return (
                    <button
                      key={s.id}
                      disabled={isFull}
                      onClick={() => setSelectedScheduleId(s.id)}
                      className={`flex justify-between items-center p-3 rounded-lg border-2 text-left ${
                        isFull ? 'bg-slate-50 border-slate-100 opacity-50' :
                        isSelected ? 'border-[#14B8A6] bg-[#14B8A6]/10' : 'border-slate-200 hover:border-[#14B8A6]/40'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-sm text-slate-800">{s.startTime} - {s.endTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-600">{s.slotsLeft} Slots Left</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 text-center">No sessions available on this date.</p>
            )}
          </div>

          {/* Step 3: Patient Info */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <label className="text-xs font-bold text-slate-600 block">Patient Details</label>
            
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
              <Phone className="h-4 w-4 text-slate-400" />
              <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none" />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
                <User className="h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Patient Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none" />
              </div>
              <div className="w-24 flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
                <input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none text-center" />
              </div>
            </div>
          </div>

          {message && (
            <div className={`mt-5 p-3 rounded-lg text-xs font-bold border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <button
            onClick={handleBookWalkIn}
            disabled={isSubmitting || !selectedScheduleId || !phone || !name}
            className="w-full py-3 bg-[#252a67] text-white font-bold rounded-xl shadow-md disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Walk-in Booking"}
          </button>
        </div>

      </div>
    </div>
  );
}