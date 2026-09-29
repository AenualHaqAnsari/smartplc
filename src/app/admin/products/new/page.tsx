"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
};

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [specifications, setSpecifications] = useState("{}");
  const [description, setDescription] =
    useState("");
  const [shortDescription, setShortDescription] =
    useState("");

  const [seoTitle, setSeoTitle] =
    useState("");

  const [seoDescription, setSeoDescription] =
    useState("");

  const [basePrice, setBasePrice] =
    useState("");

  const [compareAtPrice, setCompareAtPrice] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [status, setStatus] =
    useState("DRAFT");

  const [featured, setFeatured] =
    useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch(
          "/api/admin/categories"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load categories."
          );
        }

        setCategories(data.categories || []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load categories."
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(
    value: string
  ) {
    setName(value);

    if (!slug) {
      setSlug(createSlug(value));
    }
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Product slug is required.");
      return;
    }

    if (!description.trim()) {
      setError(
        "Product description is required."
      );
      return;
    }

    if (!basePrice || Number(basePrice) < 0) {
      setError("Enter a valid product price.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/admin/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            slug: slug.trim(),
            sku: sku.trim() || null,
            brand: brand.trim() || null,
            model: model.trim() || null,
            specifications,
            description:
              description.trim(),
            shortDescription:
              shortDescription.trim() ||
              null,
            seoTitle:
              seoTitle.trim() || null,

            seoDescription:
              seoDescription.trim() || null,
            basePrice: Number(basePrice),
            compareAtPrice:
              compareAtPrice
                ? Number(compareAtPrice)
                : null,
            categoryId,
            status,
            featured,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to create product."
        );
      }

      router.push(
        `/admin/products/${data.product.id}`
      );
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create product."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <header className="border-b border-[#e2e8f0]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#0369a1]">
              Store Administration
            </p>

            <h1 className="mt-1 font-serif text-2xl font-bold tracking-[0.08em]">
              INDUSTRIAL AUTOMATION
            </h1>
          </div>

          <Link
            href="/admin/products"
            className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#075985]"
          >
            Products
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
          Catalog
        </p>

        <h2 className="mt-3 font-serif text-5xl font-bold">
          ADD PRODUCT
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-8"
        >
          {/* Basic Information */}
          <section className="border border-[#e2e8f0] bg-[#ffffff] p-7">
            <h3 className="font-serif text-2xl font-bold">
              Basic Information
            </h3>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Field
                label="Product Name"
                value={name}
                onChange={handleNameChange}
                placeholder="PLC CPU"
                required
              />

              <Field
                label="SKU"
                value={sku}
                onChange={setSku}
                placeholder="PLC-CPU-001"
              />

              <Field label="Brand" value={brand} onChange={setBrand} placeholder="Manufacturer brand, when verified" />
              <Field label="Model" value={model} onChange={setModel} placeholder="Manufacturer model number" />
              <Field
                label="Slug"
                value={slug}
                onChange={setSlug}
                placeholder="plc-cpu-model"
                required
              />

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#a79d8e]">
                  Category
                </label>

                <select
                  value={categoryId}
                  onChange={(event) =>
                    setCategoryId(
                      event.target.value
                    )
                  }
                  disabled={loadingCategories}
                  className="w-full border border-[#4a4031] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none focus:border-[#0284c7]"
                >
                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select category"}
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-slate-600">Technical Specifications (JSON)</label>
              <textarea value={specifications} onChange={(event) => setSpecifications(event.target.value)} rows={5} placeholder={'{"Supply Voltage":"verified value","Communication":"verified value"}'} className="w-full border border-slate-300 bg-white px-4 py-3 font-mono text-sm text-slate-900" />
              <p className="mt-2 text-xs text-slate-500">Enter confirmed specifications only.</p>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#a79d8e]">
                Short Description
              </label>

              <textarea
                value={shortDescription}
                onChange={(event) =>
                  setShortDescription(
                    event.target.value
                  )
                }
                rows={3}
                className="w-full resize-none border border-[#4a4031] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none focus:border-[#0284c7]"
                placeholder="A short description shown in product listings."
              />
            </div>

            <div className="mt-6 border-t border-[#e2e8f0] pt-6">
              <p className="mb-5 text-xs uppercase tracking-[0.2em] text-[#0369a1]">
                Search Engine Optimization
              </p>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#a79d8e]">
                  SEO Title
                </label>

                <input
                  value={seoTitle}
                  onChange={(event) =>
                    setSeoTitle(event.target.value)
                  }
                  maxLength={60}
                  placeholder="Industrial PLC CPU | Industrial Automation"
                  className="w-full border border-[#4a4031] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none focus:border-[#0284c7]"
                />

                <p className="mt-2 text-xs text-[#475569]">
                  Recommended: up to 60 characters. Include the main product keyword naturally.
                </p>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#a79d8e]">
                  SEO Description
                </label>

                <textarea
                  value={seoDescription}
                  onChange={(event) =>
                    setSeoDescription(event.target.value)
                  }
                  maxLength={160}
                  rows={4}
                  placeholder="Describe the product's intended industrial application, key features and compatibility."
                  className="w-full resize-y border border-[#4a4031] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none focus:border-[#0284c7]"
                />

                <p className="mt-2 text-xs text-[#475569]">
                  Recommended: up to 160 characters. Describe the product clearly and naturally.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#a79d8e]">
                Full Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                rows={8}
                required
                className="w-full resize-y border border-[#4a4031] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none focus:border-[#0284c7]"
                placeholder="Detailed product description..."
              />
            </div>
          </section>

          {/* Pricing */}
          <section className="border border-[#e2e8f0] bg-[#ffffff] p-7">
            <h3 className="font-serif text-2xl font-bold">
              Pricing
            </h3>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Field
                label="Base Price (USD)"
                value={basePrice}
                onChange={setBasePrice}
                type="number"
                min="0"
                step="0.01"
                placeholder="499.00"
                required
              />

              <Field
                label="Compare-at Price (USD)"
                value={compareAtPrice}
                onChange={setCompareAtPrice}
                type="number"
                min="0"
                step="0.01"
                placeholder="599.00"
              />
            </div>
          </section>

          {/* Publishing */}
          <section className="border border-[#e2e8f0] bg-[#ffffff] p-7">
            <h3 className="font-serif text-2xl font-bold">
              Publishing
            </h3>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#a79d8e]">
                  Product Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value
                    )
                  }
                  className="w-full border border-[#4a4031] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none focus:border-[#0284c7]"
                >
                  <option value="DRAFT">
                    Draft
                  </option>

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="ARCHIVED">
                    Archived
                  </option>
                </select>
              </div>

              <label className="flex cursor-pointer items-center gap-4 self-end border border-[#4a4031] px-4 py-3">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) =>
                    setFeatured(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-[#0284c7]"
                />

                <span>
                  <span className="block text-sm font-semibold">
                    Featured Product
                  </span>

                  <span className="mt-1 block text-xs text-[#475569]">
                    Show this product in featured sections.
                  </span>
                </span>
              </label>
            </div>
          </section>

          {error && (
            <div className="border border-[#5b352d] bg-[#211411] px-5 py-4 text-sm text-[#d79b8d]">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Link
              href="/admin/products"
              className="border border-[#cbd5e1] px-7 py-4 text-sm uppercase tracking-[0.15em] hover:border-[#0877b9]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="bg-[#0284c7] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#17130d] hover:bg-[#dfc17d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Creating..."
                : "Create Product"}
            </button>
          </div>
        </form>
      </section>
    </main>
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
        className="w-full border border-[#4a4031] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none focus:border-[#0284c7]"
      />
    </div>
  );
}
