"use client";

import { useEffect, useRef } from "react";

export default function AnalyticsTracker() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;

    sent.current = true;

    fetch("/api/analytics/track", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: window.location.pathname,
      }),
    }).catch(() => {});
  }, []);

  return null;
}