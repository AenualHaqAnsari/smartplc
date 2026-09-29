"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Variant = {
    
  id: string;
  name: string;
  sku: string | null;
  price: number | string;
  stock: number;
  size: string | null;
  gauge: string | null;
  finish: string | null;
  customAvailable: boolean;
};
const LOW_STOCK_THRESHOLD = 5;
function getStockStatus(stock: number) {
  if (stock <= 0) {
    return {
      label: "OUT OF STOCK",
      className:
        "text-[#d79b8d]",
    };
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return {
      label: "LOW STOCK",
      className:
        "text-[#0877b9]",
    };
  }

  return {
    label: "IN STOCK",
    className:
      "text-[#9fa88f]",
  };
}

export default function VariantManager({
  productId,
  variants,
}: {
  productId: string;
  variants: Variant[];
}) {
  const router = useRouter();

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    size: "",
    gauge: "",
    finish: "",
    customAvailable: false,
  });

  function startEditing(
    variant: Variant
  ) {
    setEditingId(variant.id);

    setForm({
      name: variant.name,
      sku: variant.sku || "",
      price: String(variant.price),
      stock: String(variant.stock),
      size: variant.size || "",
      gauge: variant.gauge || "",
      finish: variant.finish || "",
      customAvailable:
        variant.customAvailable,
    });

    setMessage("");
    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setMessage("");
    setError("");
  }

  async function saveVariant() {
    if (!editingId) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/variants`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            variantId: editingId,
            name: form.name,
            sku: form.sku || null,
            price: Number(form.price),
            stock: Number(form.stock),
            size: form.size || null,
            gauge: form.gauge || null,
            finish: form.finish || null,
            customAvailable:
              form.customAvailable,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update variant."
        );
      }

      setMessage(
        "Variant updated successfully."
      );

      setEditingId(null);

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update variant."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteVariant(
    variantId: string
  ) {
    const confirmed = window.confirm(
      "Delete this variant?"
    );

    if (!confirmed) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/variants?variantId=${encodeURIComponent(
          variantId
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to delete variant."
        );
      }

      setMessage(
        "Variant deleted successfully."
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete variant."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8">
      {message && (
        <div className="mb-5 border border-[#cbd5e1] bg-[#17140f] px-4 py-3 text-sm text-[#0877b9]">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 border border-[#5b352d] bg-[#211411] px-4 py-3 text-sm text-[#d79b8d]">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead>
            <tr className="border-b border-[#e2e8f0] text-left">
              <th className="px-4 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                Variant
              </th>

              <th className="px-4 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                Size
              </th>

              <th className="px-4 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                Gauge
              </th>

              <th className="px-4 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                Finish
              </th>

              <th className="px-4 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                Price
              </th>

              <th className="px-4 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                Stock
              </th>

              <th className="px-4 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                Custom
              </th>

              <th className="px-4 py-4 text-xs uppercase tracking-[0.15em] text-[#475569]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {variants.map((variant) => {
              const editing =
                editingId === variant.id;

              if (editing) {
                return (
                  <tr
                    key={variant.id}
                    className="border-b border-[#e2e8f0] bg-[#f1ece2]"
                  >
                    <td className="px-4 py-4">
                      <input
                        value={form.name}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            name: event.target.value,
                          })
                        }
                        className="w-52 border border-[#4a4031] bg-[#f8fafc] px-3 py-2 text-sm outline-none focus:border-[#0284c7]"
                      />

                      <input
                        value={form.sku}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            sku: event.target.value,
                          })
                        }
                        placeholder="SKU"
                        className="mt-2 w-52 border border-[#4a4031] bg-[#f8fafc] px-3 py-2 text-xs outline-none focus:border-[#0284c7]"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <input
                        value={form.size}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            size: event.target.value,
                          })
                        }
                        className="w-28 border border-[#4a4031] bg-[#f8fafc] px-3 py-2 text-sm outline-none focus:border-[#0284c7]"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={form.gauge}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            gauge: event.target.value,
                          })
                        }
                        className="w-32 border border-[#4a4031] bg-[#f8fafc] px-3 py-2 text-sm outline-none focus:border-[#0284c7]"
                      >
                        <option value="">
                          Select gauge
                        </option>

                        <option value="12 Gauge">
                          12 Gauge
                        </option>

                        <option value="14 Gauge">
                          14 Gauge
                        </option>

                        <option value="16 Gauge">
                          16 Gauge
                        </option>

                        <option value="18 Gauge">
                          18 Gauge
                        </option>
                      </select>
                    </td>

                    <td className="px-4 py-4">
                      <input
                        value={form.finish}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            finish: event.target.value,
                          })
                        }
                        className="w-36 border border-[#4a4031] bg-[#f8fafc] px-3 py-2 text-sm outline-none focus:border-[#0284c7]"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            price: event.target.value,
                          })
                        }
                        className="w-28 border border-[#4a4031] bg-[#f8fafc] px-3 py-2 text-sm outline-none focus:border-[#0284c7]"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={form.stock}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            stock: event.target.value,
                          })
                        }
                        className="w-24 border border-[#4a4031] bg-[#f8fafc] px-3 py-2 text-sm outline-none focus:border-[#0284c7]"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={
                          form.customAvailable
                        }
                        onChange={(event) =>
                          setForm({
                            ...form,
                            customAvailable:
                              event.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-[#0284c7]"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={saveVariant}
                          disabled={saving}
                          className="bg-[#0284c7] px-3 py-2 text-xs font-bold uppercase text-[#17130d] disabled:opacity-50"
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={
                            cancelEditing
                          }
                          disabled={saving}
                          className="border border-[#cbd5e1] px-3 py-2 text-xs uppercase"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={variant.id}
                  className="border-b border-[#e2e8f0]"
                >
                  <td className="px-4 py-4">
                    <p className="font-semibold">
                      {variant.name}
                    </p>

                    {variant.sku && (
                      <p className="mt-1 text-xs text-[#475569]">
                        {variant.sku}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-4 text-sm text-[#999184]">
                    {variant.size || "Not set"}
                  </td>

                  <td className="px-4 py-4 text-sm text-[#999184]">
                    {variant.gauge || "Not set"}
                  </td>

                  <td className="px-4 py-4 text-sm text-[#999184]">
                    {variant.finish || "Not set"}
                  </td>

                  <td className="px-4 py-4 font-semibold text-[#0877b9]">
                    $
                    {Number(
                      variant.price
                    ).toFixed(2)}
                  </td>

                  <td className="px-4 py-4">
  {(() => {
    const stockStatus =
      getStockStatus(variant.stock);

    return (
      <div>
        <p className="font-semibold">
          {variant.stock}
        </p>

        <p
          className={`mt-1 text-[10px] font-bold uppercase tracking-[0.12em] ${stockStatus.className}`}
        >
          {stockStatus.label}
        </p>
      </div>
    );
  })()}
</td>

                  <td className="px-4 py-4 text-xs uppercase text-[#475569]">
                    {variant.customAvailable
                      ? "Yes"
                      : "No"}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          startEditing(
                            variant
                          )
                        }
                        className="border border-[#cbd5e1] px-3 py-2 text-xs uppercase hover:border-[#0877b9] hover:text-[#0877b9]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteVariant(
                            variant.id
                          )
                        }
                        disabled={saving}
                        className="border border-[#5b352d] px-3 py-2 text-xs uppercase text-[#d79b8d] hover:bg-[#211411] disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {variants.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-12 text-center text-sm text-[#475569]"
                >
                  No variants yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
