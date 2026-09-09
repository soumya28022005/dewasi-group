import { useCallback, useEffect, useState } from "react";

export type LocationStatus = "idle" | "loading" | "granted" | "denied" | "manual";

/**
 * Detects the user's city from browser geolocation (with their permission),
 * reverse-geocoded via OpenStreetMap's free Nominatim API — no API key needed.
 * Falls back gracefully, and always lets the person type a city in manually.
 */
export function useLocationCity() {
  const [city, setCity] = useState<string | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");

  const detect = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("denied");
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await res.json();
          const address = data?.address ?? {};
          const detected =
            address.city || address.town || address.village || address.county || null;

          if (detected) {
            setCity(detected);
            setStatus("granted");
          } else {
            setStatus("denied");
          }
        } catch {
          setStatus("denied");
        }
      },
      () => setStatus("denied"),
      { timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    detect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setManualCity(value: string) {
    setCity(value || null);
    setStatus(value ? "manual" : "idle");
  }

  return { city, status, detect, setManualCity };
}