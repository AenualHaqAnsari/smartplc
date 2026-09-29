"use client";

import { useState } from "react";

export default function ReviewActions({
  reviewId,
}: {
  reviewId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function approveReview() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to approve review.");
        return;
      }

      window.location.reload();
    } catch {
      alert("Unable to approve review.");
    } finally {
      setLoading(false);
    }
  }

  async function rejectReview() {
    if (
      !window.confirm(
        "Are you sure you want to reject and delete this review?"
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to reject review.");
        return;
      }

      window.location.reload();
    } catch {
      alert("Unable to reject review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex shrink-0 gap-3">
      <button
        type="button"
        onClick={approveReview}
        disabled={loading}
        className="border border-[#6f8f5f] bg-[#182015] px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#9fc38a] transition hover:bg-[#202c1c] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Working..." : "Approve"}
      </button>

      <button
        type="button"
        onClick={rejectReview}
        disabled={loading}
        className="border border-[#6f4b43] bg-[#1c1210] px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#c98f82] transition hover:bg-[#2a1714] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
