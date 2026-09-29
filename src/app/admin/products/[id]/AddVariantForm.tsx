"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddVariantForm({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] =
    useState("");
  const [stock, setStock] = useState("0");
  const [size, setSize] = useState("");
  const [sizeType, setSizeType] =
    useState("STANDARD");
  const [gauge, setGauge] = useState("");
  const [finish, setFinish] = useState("");
  const [customAvailable, setCustomAvailable] =
    useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Variant name is required.");
      return;
    }

    if (!price || Number(price) < 0) {
      setError("Enter a valid price.");
      return;
    }

    if (
      !Number.isInteger(Number(stock)) ||
      Number(stock) < 0
    ) {
      setError(
        "Stock must be a whole number of 0 or greater."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/variants`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            sku: sku.trim() || null,
            price: Number(price),
            compareAtPrice:
              compareAtPrice
                ? Number(compareAtPrice)
                : null,
            stock: Number(stock),
            size: size.trim() || null,
            sizeType,
            gauge: gauge.trim() || null,
            finish: finish.trim() || null,
            customAvailable,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to create variant."
        );
      }

      setName("");
      setSku("");
      setPrice("");
      setCompareAtPrice("");
      setStock("0");
      setSize("");
      setSizeType("STANDARD");
      setGauge("");
      setFinish("");
      setCustomAvailable(false);

      setSuccess(
        "Variant created successfully."
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create variant."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 border border-[#4a4031] bg-[#f8fafc] p-6"
    >
      <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
        Inventory
      </p>

      <h4 className="mt-2 font-serif text-xl font-bold">
        ADD VARIANT
      </h4>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field
          label="Variant Name"
          value={name}
          onChange={setName}
          placeholder="18 Gauge / Medium / Blackened"
          required
        />

        <Field
          label="SKU"
          value={sku}
          onChange={setSku}
          placeholder="TEMP-18-M-BLK"
        />

        <Field
          label="Price (USD)"
          value={price}
          onChange={setPrice}
          type="number"
          min="0"
          step="0.01"
          placeholder="499.00"
          required
        />

        <Field
          label="Compare-at Price"
          value={compareAtPrice}
          onChange={setCompareAtPrice}
          type="number"
          min="0"
          step="0.01"
          placeholder="599.00"
        />

        <Field
          label="Stock"
          value={stock}
          onChange={setStock}
          type="number"
          min="0"
          step="1"
          placeholder="10"
          required
        />

        <Field
          label="Size"
          value={size}
          onChange={setSize}
          placeholder="Medium"
        />

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#a79d8e]">
            Size Type
          </label>

          <select
            value={sizeType}
            onChange={(event) =>
              setSizeType(event.target.value)
            }
            className="w-full border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-[#17212b] outline-none focus:border-[#0284c7]"
          >
            <option value="STANDARD">
              Standard
            </option>

            <option value="CUSTOM">
              Custom
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#a79d8e]">
            Gauge
          </label>

          <select
            value={gauge}
            onChange={(event) =>
              setGauge(event.target.value)
            }
            className="w-full border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-[#17212b] outline-none focus:border-[#0284c7]"
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
        </div>

        <Field
          label="Finish"
          value={finish}
          onChange={setFinish}
          placeholder="Blackened Steel"
        />
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 border border-[#4a4031] p-4">
        <input
          type="checkbox"
          checked={customAvailable}
          onChange={(event) =>
            setCustomAvailable(
              event.target.checked
            )
          }
          className="mt-1 h-4 w-4 accent-[#0284c7]"
        />

        <span>
          <span className="block text-sm font-semibold">
            Custom sizing available
          </span>

          <span className="mt-1 block text-xs text-[#475569]">
            Customers can provide their
            measurements for this variant.
          </span>
        </span>
      </label>

      {error && (
        <div className="mt-5 border border-[#5b352d] bg-[#211411] px-4 py-3 text-sm text-[#d79b8d]">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 border border-[#cbd5e1] bg-[#17140f] px-4 py-3 text-sm text-[#0877b9]">
          {success}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#0284c7] px-7 py-3 text-sm font-bold uppercase tracking-[0.15em] text-[#17130d] hover:bg-[#dfc17d] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Adding..."
            : "Add Variant"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  step,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#a79d8e]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        min={min}
        step={step}
        required={required}
        className="w-full border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-[#17212b] outline-none focus:border-[#0284c7]"
      />
    </div>
  );
}