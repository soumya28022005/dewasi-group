"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "@/i18n/routing";
import { ExtendedDoctor } from "@/types/doctor";
import { useBookAppointment } from "@/lib/hooks/useDoctorSearch";
import { api } from "@/lib/api";
import { MapPin, Globe, AlertTriangle, Building2, Calendar, Clock, X, PhoneCall, Navigation, Loader2, Mail, ChevronLeft, ChevronRight } from "lucide-react";

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const doctorId = params.id as string;

  const [doctor, setDoctor] = useState<ExtendedDoctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal & Booking States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [date, setDate] = useState("");
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [isFetchingSchedules, setIsFetchingSchedules] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const bookMutation = useBookAppointment();

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await api.get(`/doctors/${doctorId}`);
        if (res.data?.success) setDoctor(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    async function fetchClinicSchedules() {
      if (!selectedClinic || !date) return;
      setIsFetchingSchedules(true);
      setSelectedScheduleId("");
      try {
        const res = await api.get(`/doctors/${doctorId}/clinics/${selectedClinic.id}/schedules?date=${date}`);
        if (res.data?.success) {
          setSchedules(res.data.data.schedules || []);
        }
      } catch (err) {
        setSchedules([]);
      } finally {
        setIsFetchingSchedules(false);
      }
    }
    fetchClinicSchedules();
  }, [selectedClinic, date, doctorId]);

  const openBookingModal = (clinic: any) => {
    setSelectedClinic(clinic);
    setDate("");
    setSchedules([]);
    setSelectedScheduleId("");
    setMessage(null);
    setIsModalOpen(true);
    setCurrentMonth(new Date());
    setSelectedDate(null);
  };

  const handleConfirmBooking = () => {
    if (!user) {
      router.push(`/login?redirect=/doctors/${doctorId}`);
      return;
    }
    if (!date || !selectedScheduleId) {
      setMessage({ type: "error", text: "Please select a date and time slot." });
      return;
    }

    bookMutation.mutate(
      {
        doctorId: doctor!.id,
        clinicId: selectedClinic.id,
        date: date,
        scheduleId: selectedScheduleId,
      },
      {
        onSuccess: (appointment) => {
          setMessage({ type: "success", text: `Booking confirmed! Token #${appointment.token || appointment.id}` });
          setSchedules(prev => prev.map(s => s.id === selectedScheduleId ? { ...s, slotsLeft: s.slotsLeft - 1, currentBookings: s.currentBookings + 1 } : s));
          setTimeout(() => setIsModalOpen(false), 3000);
        },
        onError: (err) => setMessage({ type: "error", text: err.message || "Failed to book appointment" }),
      }
    );
  };

  // Calendar helpers
  const getDaysInMonth = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const days = [];
    for (let d = firstDay.getDate(); d <= lastDay.getDate(); d++) {
      days.push(new Date(year, monthIndex, d));
    }
    return days;
  };

  const getWeekdayOffset = (month: Date) => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    return firstDay.getDay();
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return date < today;
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;
    const dateStr = date.toISOString().split("T")[0];
    setSelectedDate(date);
    setDate(dateStr);
    setMessage(null);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#252a67]" /></div>;
  if (!doctor) return <div className="text-center py-20 text-red-500 font-bold">Doctor Not Found</div>;

  const avatarSrc = (doctor as any).profilePhoto || doctor.user?.avatar || "https://via.placeholder.com/150";

  const generatedBio = `Dr. ${doctor.user?.name} is a verified medical professional with ${doctor.experience || 0}+ years of experience, specializing in ${doctor.specialization || "general medicine"}. They are highly rated with an average consultation time of ${doctor.avgConsultationMinutes || 15} minutes.`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 bg-[#f8f9fa] min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
            <img src={avatarSrc} alt={doctor.user?.name} className="w-48 h-48 object-cover rounded-xl shadow-sm mb-4" />
            <h1 className="text-2xl font-extrabold text-[#1e293b]">{doctor.user?.name}</h1>
            <p className="text-sm font-bold text-slate-500 mt-1">{doctor.qualification || "MBBS"}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 border-b pb-2">
              <MapPin className="h-5 w-5 text-emerald-600" /> Contact & Location
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><PhoneCall className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Doctor's Contact</p>
                  <p className="text-sm font-bold text-slate-700">{doctor.user?.phone || "Not Provided"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Mail className="h-4 w-4" /></div>
                <div className="overflow-hidden">
                  <p className="text-xs text-slate-400 font-semibold">Email Address</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{doctor.user?.email || "Not Provided"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Building2 className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Primary City</p>
                  <p className="text-sm font-bold text-slate-700">{doctor.clinic?.city || "Not Specified"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex justify-between border-b pb-4 mb-4 text-sm font-semibold text-slate-600">
              <p>Experience: <span className="text-slate-800">{doctor.experience || 0}+ Years</span></p>
              <p>Avg. Time: <span className="text-slate-800">{doctor.avgConsultationMinutes || 15} Mins</span></p>
            </div>
            <div className="mb-6 flex gap-4">
              <p className="font-bold text-slate-700 w-24 shrink-0">Specializes In:</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {doctor.specialization || "General Medicine"}
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-700 mb-2">Bio:</p>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{generatedBio}</p>
              
              <div className="bg-amber-50 border border-amber-100 text-amber-800 text-xs p-3 rounded-lg flex gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                <p>This is a verified doctor on the platform. Please check available timings before booking.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-lg font-bold text-[#d97706] flex items-center gap-2">
                <Building2 className="h-5 w-5" /> Chamber Information
              </h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {doctor.allClinics?.length || 0} Chambers
              </span>
            </div>

            <div className="space-y-4">
              {doctor.allClinics?.map((clinic) => (
                <div key={clinic.id} className="flex flex-col sm:flex-row gap-4 border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-slate-50/50">
                  <div className="w-full sm:w-40 h-32 bg-white border border-slate-200 rounded-lg overflow-hidden shrink-0">
                    {clinic.logo ? (
                      <img src={clinic.logo} alt={clinic.clinicName} className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-slate-400"><Building2 className="h-8 w-8" /></div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{clinic.clinicName}</h3>
                      <p className="text-xs text-slate-500 mt-1.5 flex items-start gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-red-500" />
                        {clinic.address ? `${clinic.address}, ` : ""}{clinic.city ? clinic.city : "Address not provided"}
                      </p>
                      {clinic.phone && (
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <PhoneCall className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                          {clinic.phone}
                        </p>
                      )}
                      <p className="text-xs font-bold text-slate-700 mt-3">Consultation Fee: ₹{clinic.associationDetails?.fee || doctor.fee}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full sm:w-48 shrink-0 justify-center">
                    <button onClick={() => openBookingModal(clinic)} className="w-full py-2 bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                      <Calendar className="h-4 w-4" /> Book Appointment
                    </button>
                    {clinic.phone && (
                      <a href={`tel:${clinic.phone}`} className="w-full py-2 bg-[#1e293b] hover:bg-[#0f172a] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                        <PhoneCall className="h-4 w-4" /> Call Clinic
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal Popup - with custom calendar */}
      {isModalOpen && selectedClinic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#2a2a72] p-5 flex justify-between items-start text-white">
              <div className="flex gap-3 items-center">
                <div className="bg-white/20 p-2 rounded-lg"><Calendar className="h-6 w-6" /></div>
                <div>
                  <h3 className="font-bold text-lg">Book Appointment</h3>
                  <p className="text-xs text-blue-200">at {selectedClinic.clinicName}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-6">
              {/* Custom Calendar */}
              <div className="mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Step 1: Choose Date</p>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevMonth} className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-sm font-bold text-slate-700">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={handleNextMonth} className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                      <div key={day} className="text-center text-[10px] font-bold text-slate-400">{day}</div>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells before first day */}
                    {Array.from({ length: getWeekdayOffset(currentMonth) }).map((_, index) => (
                      <div key={`empty-${index}`} />
                    ))}
                    {/* Days */}
                    {getDaysInMonth(currentMonth).map((day) => {
                      const dayDate = day.getDate();
                      const isDisabled = isDateDisabled(day);
                      const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
                      const isToday = day.toDateString() === new Date().toDateString();
                      return (
                        <button
                          key={day.toISOString()}
                          disabled={isDisabled}
                          onClick={() => handleDateSelect(day)}
                          className={`h-8 w-8 mx-auto flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-[#2a2a72] text-white shadow-md'
                              : isDisabled
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-700 hover:bg-[#2a2a72]/10 hover:scale-105'
                          } ${isToday && !isSelected ? 'ring-1 ring-blue-300' : ''}`}
                        >
                          {dayDate}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Time Slots Section */}
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Step 2: Choose Timing</p>
              {!date ? (
                <p className="text-xs text-slate-400 italic mb-4">Please select a date first.</p>
              ) : isFetchingSchedules ? (
                <p className="text-xs text-slate-500 flex items-center gap-2 mb-4"><Loader2 className="h-4 w-4 animate-spin"/> Checking slots...</p>
              ) : schedules.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {schedules.map((s) => {
                    const isFull = s.slotsLeft <= 0;
                    const isSelected = selectedScheduleId === s.id;
                    return (
                      <button
                        key={s.id}
                        disabled={isFull}
                        onClick={() => { setSelectedScheduleId(s.id); setMessage(null); }}
                        className={`w-full flex justify-between items-center p-4 rounded-xl border-2 transition-all text-left ${
                          isFull ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed' :
                          isSelected ? 'border-[#2a2a72] bg-blue-50/50' : 'border-slate-100 hover:border-[#2a2a72]/30'
                        }`}
                      >
                        <div>
                          <p className={`font-bold ${isSelected ? 'text-[#2a2a72]' : 'text-slate-800'}`}>
                            {s.startTime < "12:00" ? "Morning Session" : s.startTime < "17:00" ? "Afternoon Session" : "Evening Session"}
                          </p>
                          <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" /> {s.startTime} - {s.endTime}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-[10px] font-bold uppercase tracking-wide ${isFull ? 'text-red-500' : 'text-emerald-600'}`}>
                            {isFull ? 'Full' : 'Available'}
                          </p>
                          <p className="text-xs font-bold text-slate-600 mt-0.5">
                            {s.slotsLeft} Slots Left
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 mb-4">No sessions available on this date.</p>
              )}

              {message && (
                <div className={`mb-4 p-3 rounded-lg text-xs font-bold border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {message.text}
                </div>
              )}

              <button
                onClick={handleConfirmBooking}
                disabled={bookMutation.isPending || !date || !selectedScheduleId}
                className="w-full py-3.5 bg-[#8e94b6] text-white font-bold rounded-lg shadow-sm hover:bg-[#7a81a6] disabled:opacity-50 flex justify-center items-center gap-2 transition-colors"
              >
                {bookMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}