"use client";

import React, { useState, useEffect } from "react";

// API Base URL - Exact port ta use koro jeta backend e cholche
const API_BASE = process.env.NEXT_PUBLIC_API_URL

export default function DirectorySections() {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [featuredClinics, setFeaturedClinics] = useState([]);
  const [allClinics, setAllClinics] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  
  const [showAvailable, setShowAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [fDocsRes, aDocsRes, fClinicsRes, aClinicsRes] = await Promise.all([
          fetch(`${API_BASE}/doctors/featured`).then((res) => res.json()),
          fetch(`${API_BASE}/doctors`).then((res) => res.json()),
          fetch(`${API_BASE}/clinic/featured`).then((res) => res.json()),
          fetch(`${API_BASE}/clinic`).then((res) => res.json()),
        ]);

        if (fDocsRes?.success) setFeaturedDoctors(fDocsRes.data);
        if (aDocsRes?.success) setAllDoctors(aDocsRes.data);
        if (fClinicsRes?.success) setFeaturedClinics(fClinicsRes.data);
        if (aClinicsRes?.success) setAllClinics(aClinicsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Available Doctors Fetch
  const handleShowAvailable = async () => {
    if (!showAvailable && availableDoctors.length === 0) {
      try {
        const res = await fetch(`${API_BASE}/doctors/available`);
        const data = await res.json();
        if (data?.success) setAvailableDoctors(data.data);
      } catch (error) {
        console.error("Error fetching available doctors:", error);
      }
    }
    setShowAvailable(!showAvailable);
  };

  // Reusable Card Component
  const RenderCard = ({ title, subtitle, isAvailable }: { title: string, subtitle: string, isAvailable?: boolean }) => (
    <div className="p-4 border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
      <h3 className="font-bold text-lg text-gray-800">{title || "Unknown"}</h3>
      <p className="text-gray-500 text-sm mb-2">{subtitle}</p>
      {isAvailable !== undefined && (
        <span className={`px-2 py-1 text-xs rounded-full ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isAvailable ? 'Available' : 'Unavailable'}
        </span>
      )}
    </div>
  );

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading directories...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-12">
      
      {/* 1. Featured Doctors */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-blue-600">🌟 Featured Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredDoctors.map((doc: any) => (
            <RenderCard key={doc.id} title={doc.user?.name} subtitle={doc.specialization || "General"} isAvailable={doc.isAvailable} />
          ))}
          {featuredDoctors.length === 0 && <p className="text-gray-500">No featured doctors found.</p>}
        </div>
      </section>

      {/* 2. All Doctors */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">👨‍⚕️ All Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allDoctors.map((doc: any) => (
            <RenderCard key={doc.id} title={doc.user?.name} subtitle={doc.specialization || "General"} isAvailable={doc.isAvailable} />
          ))}
          {allDoctors.length === 0 && <p className="text-gray-500">No doctors found.</p>}
        </div>
      </section>

      {/* 3. Featured Clinics */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-purple-600">🏥 Featured Clinics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredClinics.map((clinic: any) => (
            <RenderCard key={clinic.id} title={clinic.clinicName} subtitle={`${clinic.city || ''}, ${clinic.state || ''}`} />
          ))}
          {featuredClinics.length === 0 && <p className="text-gray-500">No featured clinics found.</p>}
        </div>
      </section>

      {/* 4. All Clinics */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">🏥 All Clinics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allClinics.map((clinic: any) => (
            <RenderCard key={clinic.id} title={clinic.clinicName} subtitle={`${clinic.city || ''}, ${clinic.state || ''}`} />
          ))}
          {allClinics.length === 0 && <p className="text-gray-500">No clinics found.</p>}
        </div>
      </section>

      {/* 5. Available Doctors Button & Section */}
      <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl font-bold mb-2">Need a doctor right now?</h2>
          <p className="text-gray-500 mb-4">Click below to see doctors who are currently available for consultation.</p>
          <button 
            onClick={handleShowAvailable}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            {showAvailable ? "Hide Available Doctors" : "Show Available Doctors"}
          </button>
        </div>

        {showAvailable && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-green-700">✅ Currently Available Doctors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableDoctors.map((doc: any) => (
                <RenderCard key={doc.id} title={doc.user?.name} subtitle={doc.specialization || "General"} isAvailable={doc.isAvailable} />
              ))}
              {availableDoctors.length === 0 && <p className="text-gray-500">No doctors are currently available.</p>}
            </div>
          </div>
        )}
      </section>

    </div>
  );
}