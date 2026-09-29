"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductStatus =
  | "DRAFT"
  | "ACTIVE"
  | "ARCHIVED";

export default function StatusManager({
  productId,
  currentStatus,
}: {
  productId: string;
  currentStatus: ProductStatus;
}) {
  const router = useRouter();

  const [status, setStatus] =
    useState<ProductStatus>(currentStatus);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function saveStatus() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/admin/products/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update product status."
        );
      }

      setMessage(
        "Product status updated successfully."
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update product status."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 border border-[#4a4031] bg-[#f8fafc] p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#475569]">
            Product Status
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target
                  .value as ProductStatus
              )
            }
            className="w-full border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-sm text-[#17212b] outline-none focus:border-[#0284c7] sm:max-w-md"
          >
            <option value="DRAFT">
              DRAFT
            </option>

            <option value="ACTIVE">
              ACTIVE
            </option>

            <option value="ARCHIVED">
              ARCHIVED
            </option>
          </select>

          <p className="mt-2 text-xs leading-5 text-[#475569]">
            ACTIVE products are visible on
            the customer storefront. DRAFT
            products are hidden.
          </p>
        </div>

        <button
          type="button"
          onClick={saveStatus}
          disabled={
            saving ||
            status === currentStatus
          }
          className="bg-[#0284c7] px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-[#17130d] hover:bg-[#dfc17d] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving
            ? "Saving..."
            : "Save Status"}
        </button>
      </div>

      {message && (
        <div className="mt-4 border border-[#cbd5e1] bg-[#17140f] px-4 py-3 text-sm text-[#0877b9]">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 border border-[#5b352d] bg-[#211411] px-4 py-3 text-sm text-[#d79b8d]">
          {error}
        </div>
      )}
    </div>
  );
}