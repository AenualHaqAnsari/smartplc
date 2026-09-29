"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="text-sm uppercase tracking-[0.15em] text-[#999184] transition hover:text-[#d79b8d] disabled:opacity-50"
    >
      {loading ? "Signing Out..." : "Logout"}
    </button>
  );
}
