"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StockControlsProps = {
  productId: string;
  variantId: string;
  variantName: string;
  stock: number;
};

export default function StockControls({
  productId,
  variantId,
  variantName,
  stock,
}: StockControlsProps) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [currentStock, setCurrentStock] = useState(stock);

  async function updateStock(change: number) {
    const newStock = currentStock + change;

    if (newStock < 0 || saving) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/variants`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            variantId,
            stock: newStock,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to update stock."
        );
      }

      setCurrentStock(newStock);
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to update stock."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-[#475569]">
        {variantName}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => updateStock(-1)}
          disabled={saving || currentStock <= 0}
          className="flex h-8 w-8 items-center justify-center border border-[#cbd5e1] text-sm hover:border-[#0877b9] hover:text-[#0877b9] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Decrease stock for ${variantName}`}
        >
          -
        </button>

        <span className="min-w-8 text-center text-sm font-semibold">
          {currentStock}
        </span>

        <button
          type="button"
          onClick={() => updateStock(1)}
          disabled={saving}
          className="flex h-8 w-8 items-center justify-center border border-[#cbd5e1] text-sm hover:border-[#0877b9] hover:text-[#0877b9] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Increase stock for ${variantName}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
