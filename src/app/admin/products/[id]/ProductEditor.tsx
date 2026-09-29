"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  brand: string | null;
  model: string | null;
  specifications: unknown;
  description: string;
  shortDescription: string | null;

  seoTitle: string | null;
  seoDescription: string | null;

  basePrice: number;
  compareAtPrice: number | null;

  gauge16Extra: number;
  gauge14Extra: number;
  gauge12Extra: number;

  categoryId: string;
  featured: boolean;
};

export default function ProductEditor({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  const router = useRouter();

  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [sku, setSku] = useState(product.sku ?? "");
  const [brand, setBrand] = useState(product.brand ?? "");
  const [model, setModel] = useState(product.model ?? "");
  const [specifications, setSpecifications] = useState(JSON.stringify(product.specifications ?? {}, null, 2));

  const [description, setDescription] = useState(
    product.description
  );

  const [shortDescription, setShortDescription] =
    useState(product.shortDescription ?? "");

  const [seoTitle, setSeoTitle] =
    useState(product.seoTitle ?? "");

  const [seoDescription, setSeoDescription] =
    useState(product.seoDescription ?? "");

  const [basePrice, setBasePrice] = useState(
    product.basePrice.toString()
  );

  const [compareAtPrice, setCompareAtPrice] =
    useState(
      product.compareAtPrice !== null
        ? product.compareAtPrice.toString()
        : ""
    );

  const [gauge16Extra, setGauge16Extra] =
    useState(product.gauge16Extra.toString());

  const [gauge14Extra, setGauge14Extra] =
    useState(product.gauge14Extra.toString());

  const [gauge12Extra, setGauge12Extra] =
    useState(product.gauge12Extra.toString());

  const [categoryId, setCategoryId] = useState(
    product.categoryId
  );

  const [featured, setFeatured] = useState(
    product.featured
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function saveProduct() {
    setSaving(true);
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Product name is required.");
      setSaving(false);
      return;
    }

    if (!slug.trim()) {
      setError("Product slug is required.");
      setSaving(false);
      return;
    }

    if (!description.trim()) {
      setError("Product description is required.");
      setSaving(false);
      return;
    }

    const price = Number(basePrice);

    if (!Number.isFinite(price) || price < 0) {
      setError("Please enter a valid base price.");
      setSaving(false);
      return;
    }

    let comparePrice: number | null = null;

    if (compareAtPrice.trim()) {
      comparePrice = Number(compareAtPrice);

      if (
        !Number.isFinite(comparePrice) ||
        comparePrice < 0
      ) {
        setError(
          "Please enter a valid compare-at price."
        );
        setSaving(false);
        return;
      }
    }

    const gauge16 = Number(gauge16Extra);
    const gauge14 = Number(gauge14Extra);
    const gauge12 = Number(gauge12Extra);

    if (
      !Number.isFinite(gauge16) ||
      gauge16 < 0
    ) {
      setError(
        "Please enter a valid 16 Gauge extra price."
      );
      setSaving(false);
      return;
    }

    if (
      !Number.isFinite(gauge14) ||
      gauge14 < 0
    ) {
      setError(
        "Please enter a valid 14 Gauge extra price."
      );
      setSaving(false);
      return;
    }

    if (
      !Number.isFinite(gauge12) ||
      gauge12 < 0
    ) {
      setError(
        "Please enter a valid 12 Gauge extra price."
      );
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/products/${product.id}`,
        {
          method: "PATCH",
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
              shortDescription.trim() || null,

            seoTitle:
              seoTitle.trim() || null,

            seoDescription:
              seoDescription.trim() || null,

            basePrice: price,

            compareAtPrice:
              comparePrice,

            gauge16Extra: gauge16,
            gauge14Extra: gauge14,
            gauge12Extra: gauge12,

            categoryId,
            featured,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update product."
        );
      }

      setMessage(
        "Product information updated successfully."
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 border border-[#4a4031] bg-[#f8fafc] p-6">

      {message && (
        <div className="mb-6 border border-[#cbd5e1] bg-[#17140f] px-4 py-3 text-sm text-[#0877b9]">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 border border-[#5b352d] bg-[#211411] px-4 py-3 text-sm text-[#d79b8d]">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">

        {/* Product Name */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#475569]">
            Product Name
          </label>

          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className="w-full border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-sm text-[#17212b] outline-none focus:border-[#0284c7]"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#475569]">
            Slug
          </label>

          <input
            value={slug}
            onChange={(event) =>
              setSlug(event.target.value)
            }
            className="w-full border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-sm text-[#17212b] outline-none focus:border-[#0284c7]"
          />

          <p className="mt-2 text-xs text-[#475569]">
            Example: plc-cpu-model
          </p>
        </div>

        {/* SKU */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#475569]">
            SKU
          </label>

          <input
            value={sku}
            onChange={(event) =>
              setSku(event.target.value)
            }
            placeholder="Optional"
            className="w-full border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-sm text-[#17212b] outline-none focus:border-[#0284c7]"
          />
        </div>

        {/* Base Price */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#475569]">
            Base Price (USD)
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={basePrice}
            onChange={(event) =>
              setBasePrice(event.target.value)
            }
            className="w-full border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-sm text-[#17212b] outline-none focus:border-[#0284c7]"
          />
        </div>

        {/* Compare-at Price */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#475569]">
            Compare-at Price (USD)
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={compareAtPrice}
            onChange={(event) =>
              setCompareAtPrice(
                event.target.value
              )
            }
            placeholder="Optional"
            className="w-full border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-sm text-[#17212b] outline-none focus:border-[#0284c7]"
          />
        </div>

        {/* Gauge Pricing */}
        <div className="md:col-span-2 border border-[#4a4031] bg-[#ffffff] p-5">

          <p className="text-xs uppercase tracking-[0.2em] text-[#0369a1]">
            Gauge Pricing
          </p>

          <h3 className="mt-2 font-serif text-xl font-bold">
            GAUGE UPGRADE PRICES
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#475569]">
            18 Gauge is included in the base product
            price. Set the additional charge for
            heavier gauges below.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* 18 Gauge */}
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#475569]">
                18 Gauge
              </label>

              <div className="border border-[#4a4031] bg-[#17140f] px-4 py-3 text-sm text-[#0877b9]">
                Included - $0
              </div>
            </div>

            {/* 16 Gauge */}
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#475569]">
                16 Gauge Extra
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569]">
                  $
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={gauge16Extra}
                  onChange={(event) =>
                    setGauge16Extra(
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                  className="w-full border border-[#4a4031] bg-[#f8fafc] py-3 pl-8 pr-4 text-sm text-[#17212b] outline-none focus:border-[#0284c7]"
                />
              </div>
            </div>

            {/* 14 Gauge */}
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#475569]">
                14 Gauge Extra
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569]">
                  $
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={gauge14Extra}
                  onChange={(event) =>
                    setGauge14Extra(
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                  className="w-full border border-[#4a4031] bg-[#f8fafc] py-3 pl-8 pr-4 text-sm text-[#17212b] outline-none focus:border-[#0284c7]"
                />
              </div>
            </div>

            {/* 12 Gauge */}
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#475569]">
                12 Gauge Extra
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569]">
                  $
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={gauge12Extra}
                  onChange={(event) =>
                    setGauge12Extra(
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                  className="w-full border border-[#4a4031] bg-[#f8fafc] py-3 pl-8 pr-4 text-sm text-[#17212b] outline-none focus:border-[#0284c7]"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#475569]">
            Category
          </label>

          <select
            value={categoryId}
            onChange={(event) =>
              setCategoryId(event.target.value)
            }
            className="w-full border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-sm text-[#17212b] outline-none focus:border-[#0284c7]"
          >
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Featured */}
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-3 border border-[#4a4031] bg-[#ffffff] px-4 py-3">
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

            <span className="text-sm">
              Featured Product
            </span>
          </label>
        </div>

        {/* SEO Title */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#475569]">
            SEO Title
          </label>

          <input
            value={seoTitle}
            onChange={(event) =>
              setSeoTitle(event.target.value)
            }
            maxLength={60}
            placeholder="SEO title for search engines..."
            className="w-full border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-sm text-[#17212b] outline-none focus:border-[#0284c7]"
          />

          <p className="mt-2 text-xs text-[#475569]">
            Recommended: up to 60 characters.
          </p>
        </div>

        {/* SEO Description */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#475569]">
            SEO Description
          </label>

          <textarea
            value={seoDescription}
            onChange={(event) =>
              setSeoDescription(
                event.target.value
              )
            }
            maxLength={160}
            rows={4}
            placeholder="Description shown in search engine results..."
            className="w-full border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-sm leading-6 text-[#17212b] outline-none focus:border-[#0284c7]"
          />

          <p className="mt-2 text-xs text-[#475569]">
            Recommended: up to 160 characters.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Brand<input value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-sm normal-case" /></label>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Model<input value={model} onChange={(e) => setModel(e.target.value)} className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-sm normal-case" /></label>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 md:col-span-2">Technical Specifications (JSON)<textarea value={specifications} onChange={(e) => setSpecifications(e.target.value)} rows={6} className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 font-mono text-sm normal-case" /><span className="mt-1 block text-xs font-normal normal-case text-slate-500">Only add values confirmed from product documentation.</span></label>
        </div>

        {/* Short Description */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#475569]">
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
            placeholder="Short product summary..."
            className="w-full border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-sm text-[#17212b] outline-none focus:border-[#0284c7]"
          />
        </div>

        {/* Full Description */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-[#475569]">
            Full Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            rows={10}
            className="w-full border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-sm leading-7 text-[#17212b] outline-none focus:border-[#0284c7]"
          />
        </div>

      </div>

      {/* Save */}
      <div className="mt-7 flex justify-end border-t border-[#e2e8f0] pt-6">

        <button
          type="button"
          onClick={saveProduct}
          disabled={saving}
          className="bg-[#0284c7] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#17130d] hover:bg-[#dfc17d] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Product"}
        </button>

      </div>
    </div>
  );
}
