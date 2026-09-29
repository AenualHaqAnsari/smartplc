"use client";

import { useState } from "react";

export default function ClearTestOrders() {
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const canDelete =
    confirmation.trim() === "DELETE TEST ORDERS";

  async function handleDelete() {
    if (!canDelete || loading) {
      return;
    }

    const confirmed = window.confirm(
      "WARNING: This will permanently delete ALL orders and their related payment/order records. Products and customers will NOT be deleted. Continue?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/admin/orders/clear-test",
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to clear test orders."
        );
      }

      setMessage(
        data.message ||
          "Test orders cleared successfully."
      );

      setConfirmation("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to clear test orders."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 border border-[#b9aaa0] bg-[#ffffff]">
      <div className="border-b border-[#e2e8f0] px-7 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8b4f43]">
          Danger Zone
        </p>

        <h3 className="mt-2 font-serif text-2xl font-bold text-[#17212b]">
          Clear Test Orders
        </h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475569]">
          Permanently remove test orders and their
          related order records before launching the
          store.
        </p>
      </div>

      <div className="px-7 py-6">
        <div className="border border-[#e0c9c2] bg-[#faf1ed] p-4 text-sm leading-6 text-[#70483f]">
          <strong>Important:</strong> This deletes
          orders and their related payment, shipment,
          measurement, and order-item records.
          Products, variants, customers, and store
          settings are not deleted.
        </div>

        <label className="mt-6 block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#625c53]">
            Confirmation
          </span>

          <input
            type="text"
            value={confirmation}
            onChange={(event) =>
              setConfirmation(event.target.value)
            }
            placeholder="DELETE TEST ORDERS"
            disabled={loading}
            className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-sm text-[#17212b] outline-none placeholder:text-[#aaa194] focus:border-[#0877b9]"
          />
        </label>

        <button
          type="button"
          onClick={handleDelete}
          disabled={!canDelete || loading}
          className="mt-5 border border-[#8b4f43] bg-[#8b4f43] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#704038] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading
            ? "Clearing Orders..."
            : "Clear Test Orders"}
        </button>

        {message && (
          <p className="mt-4 text-sm font-semibold text-[#536b45]">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm font-semibold text-[#8b4f43]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
