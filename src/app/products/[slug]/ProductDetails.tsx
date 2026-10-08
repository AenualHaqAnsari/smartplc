"use client";

import { useEffect, useState } from "react";
import StoreHeader from "@/components/layout/StoreHeader";
import { useRouter } from "next/navigation";
import ProductImageCarousel from "./components/ProductImageCarousel";
import { useCart } from "@/components/cart/CartProvider";
import CurrencySelector from "@/components/currency/CurrencySelector";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { formatCurrency } from "@/lib/currency";
import ProductVideoGallery from "./components/ProductVideoGallery";

type ProductVariant = {
  id: string;
  name: string;
  price: string;
  compareAtPrice: string | null;
  stock: number;
  size: string | null;
  sizeType: "STANDARD" | "CUSTOM";
  gauge: string | null;
  finish: string | null;
  customAvailable: boolean;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string | null;
  model: string | null;
  specifications: string;
  basePrice: string;
  compareAtPrice: string | null;

  category: string;

  images: {
    id: string;
    url: string;
    altText: string | null;
    isPrimary: boolean;
  }[];

  videos: { id: string; url: string; title: string | null; sortOrder: number }[];

  variants: ProductVariant[];
};

type ProductReview = {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
};

type ProductDetailsProps = {
  product: Product & {
    reviews: ProductReview[];
  };
};
const measurements = [
  ["height", "Height"],
  ["chest", "Chest"],
  ["waist", "Waist"],
  ["hip", "Hip"],
  ["shoulder", "Shoulder"],
  ["armLength", "Arm Length"],
  ["bicep", "Bicep"],
  ["wrist", "Wrist"],
  ["thigh", "Thigh"],
  ["knee", "Knee"],
  ["calf", "Calf"],
  ["ankle", "Ankle"],
  ["neck", "Neck"],
  ["head", "Head"],
];

function getSpecificationEntries(value: string): [string, string | number | boolean][] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return [];
    return Object.entries(parsed).filter((entry): entry is [string, string | number | boolean] => ["string", "number", "boolean"].includes(typeof entry[1]));
  } catch { return []; }
}

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const { currency, rates } = useCurrency();
  const specificationEntries = getSpecificationEntries(product.specifications);

  const [customerCountry, setCustomerCountry] =
    useState("");

  const [basketCount, setBasketCount] = useState(0);
  const [discountSettings, setDiscountSettings] =
    useState({
      discountIndia: 0,
      discountUnitedKingdom: 0,
      discountGermany: 0,
      discountFrance: 0,
      discountItaly: 0,
      discountBelgium: 0,
      discountSpain: 0,
      discountSwitzerland: 0,
      discountUnitedStates: 0,
      discountEverywhere: 0,
    });

  useEffect(() => {
    async function loadPricingSettings() {
      try {
        const [
          countryResponse,
          settingsResponse,
        ] = await Promise.all([
          fetch("/api/account/country", {
            cache: "no-store",
          }),
          fetch("/api/store-settings", {
            cache: "no-store",
          }),
        ]);

        if (countryResponse.ok) {
          const countryData =
            await countryResponse.json();

          setCustomerCountry(
            String(countryData.country || "")
              .trim()
              .toUpperCase()
          );
        }

        if (settingsResponse.ok) {
          const settingsData =
            await settingsResponse.json();

          setDiscountSettings({
            discountIndia:
              Number(settingsData.discountIndia) || 0,
            discountUnitedKingdom:
              Number(settingsData.discountUnitedKingdom) || 0,
            discountGermany:
              Number(settingsData.discountGermany) || 0,
            discountFrance:
              Number(settingsData.discountFrance) || 0,
            discountItaly:
              Number(settingsData.discountItaly) || 0,
            discountBelgium:
              Number(settingsData.discountBelgium) || 0,
            discountSpain:
              Number(settingsData.discountSpain) || 0,
            discountSwitzerland:
              Number(settingsData.discountSwitzerland) || 0,
            discountUnitedStates:
              Number(settingsData.discountUnitedStates) || 0,
            discountEverywhere:
              Number(settingsData.discountEverywhere) || 0,
          });
        }
      } catch (error) {
        console.error(
          "PRODUCT DISPLAY PRICE LOAD ERROR:",
          error
        );
      }
    }

    loadPricingSettings();
  }, []);
  async function loadBasketCount() {
    try {
      const response = await fetch(
        `/api/products/${product.id}/baskets`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setBasketCount(
        Number(data.basketCount) || 0
      );
    } catch (error) {
      console.error(
        "BASKET COUNT LOAD ERROR:",
        error
      );
    }
  }

  useEffect(() => {
  const basketTimer = window.setTimeout(() => { void loadBasketCount(); }, 0);
  fetch("/api/analytics/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path: window.location.pathname,
      productId: product.id,
    }),
    keepalive: true,
  }).catch(() => {});
  return () => window.clearTimeout(basketTimer);
}, [product.id]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  const { addItem, items, loggedIn, totalItems } = useCart();
const router = useRouter();

  /*
   * Only STANDARD variants are used
   * for the standard-size selector.
   */
  /*
 * Customer selects the actual purchasable
 * product configuration directly.
 */
  const [selectedVariantId, setSelectedVariantId] =
    useState(product.variants[0]?.id ?? "");

  const [variantDropdownOpen, setVariantDropdownOpen] =
    useState(false);

  const [customSize, setCustomSize] =
    useState(false);

  const [quantity, setQuantity] =
    useState(1);

  const [measurementValues, setMeasurementValues] =
    useState<Record<string, string>>({});

  const selectedVariant =
    product.variants.find(
      (variant) => variant.id === selectedVariantId
    ) ?? null;

  const price = selectedVariant
    ? Number(selectedVariant.price)
    : Number(product.basePrice);

  const stock = selectedVariant?.stock ?? 0;

  const normalizedCustomerCountry =
    customerCountry.trim().toUpperCase();

  const countryDiscountMap: Record<string, number> = {
    INDIA: discountSettings.discountIndia,
    IN: discountSettings.discountIndia,

    "UNITED KINGDOM":
      discountSettings.discountUnitedKingdom,
    UK: discountSettings.discountUnitedKingdom,
    GB: discountSettings.discountUnitedKingdom,

    GERMANY: discountSettings.discountGermany,
    FRANCE: discountSettings.discountFrance,
    ITALY: discountSettings.discountItaly,
    BELGIUM: discountSettings.discountBelgium,
    SPAIN: discountSettings.discountSpain,
    SWITZERLAND: discountSettings.discountSwitzerland,

    "UNITED STATES":
      discountSettings.discountUnitedStates,
    US: discountSettings.discountUnitedStates,
    USA: discountSettings.discountUnitedStates,
  };

  const currencyCountry = currency === "INR" ? "IN" : currency === "GBP" ? "GB" : "";
  const pricingCountry = normalizedCustomerCountry || currencyCountry;
  const discountRate =
    countryDiscountMap[pricingCountry] ??
    discountSettings.discountEverywhere;

  const displayPrice =
    price * (1 - discountRate / 100);

  const displayCompareAtPrice = selectedVariant
    ? selectedVariant.compareAtPrice
    : product.compareAtPrice;
  const originalPrice = displayCompareAtPrice
    ? Math.max(price, Number(displayCompareAtPrice))
    : price;
  const hasDiscount = displayPrice < originalPrice - 0.009;


  function handleVariantChange(variantId: string) {
    setSelectedVariantId(variantId);
    setQuantity(1);
    setCustomSize(false);
    setMeasurementValues({});
  }

  function handleCustomSizeChange(enabled: boolean) {
    setCustomSize(enabled);
    setQuantity(1);
  }

  function updateMeasurement(field: string, value: string) {
    setMeasurementValues((current) => ({
      ...current,
      [field]: value,
    }));

  }

  function increaseQuantity() {
    if (
      selectedVariant &&
      quantity < selectedVariant.stock
    ) {
      setQuantity(quantity + 1);
    }
  }

  function decreaseQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  
  async function handleReviewSubmit() {
    if (!loggedIn) {
      router.push(
        "/account/login?redirect=" +
          encodeURIComponent(window.location.pathname)
      );
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      setReviewError("Please select a rating from 1 to 5 stars.");
      return;
    }

    if (!reviewTitle.trim() && !reviewComment.trim()) {
      setReviewError("Please write a review.");
      return;
    }

    setReviewSubmitting(true);
    setReviewError("");
    setReviewMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle.trim(),
          comment: reviewComment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to submit your review."
        );
      }

      setReviewRating(0);
      setReviewTitle("");
      setReviewComment("");

      setReviewMessage(
        "Thank you. Your review has been submitted and is awaiting approval."
      );
    } catch (error) {
      setReviewError(
        error instanceof Error
          ? error.message
          : "Unable to submit your review."
      );
    } finally {
      setReviewSubmitting(false);
    }
  }
async function handleBuyNow() {
  if (!loggedIn) {
    router.push(
      "/account/login?redirect=" +
        encodeURIComponent(
          window.location.pathname
        )
    );
    return;
  }

  if (!selectedVariant) {
    alert("Please select a valid product variant.");
    return;
  }

  if (stock <= 0) {
    alert("This product variant is currently unavailable.");
    return;
  }

  if (quantity > stock) {
    alert(
      "The selected quantity is greater than available stock."
    );
    return;
  }

  if (customSize) {
    const requiredMeasurements = [
      "height",
      "chest",
      "waist",
    ];

    const missing =
      requiredMeasurements.some(
        (field) => !measurementValues[field]
      );

    if (missing) {
      alert(
        "Please enter Height, Chest and Waist measurements."
      );
      return;
    }
  }

  /*
   * BUY NOW
   *
   * Always check the latest cart directly from the server.
   * This prevents a duplicate item when the customer has
   * already clicked Add to Cart.
   */

  try {
    const cartResponse = await fetch(
      "/api/cart",
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }
    );

    const cartData = await cartResponse.json();

    if (!cartResponse.ok) {
      alert(
        cartData.error ||
          "Unable to check your cart."
      );
      return;
    }

    const existingCartItem =
      cartData.cart?.items?.find(
        (item: {
          productId: string;
          variantId: string;
          customSize: boolean;
        }) =>
          item.productId === product.id &&
          item.variantId === selectedVariant.id &&
          Boolean(item.customSize) === customSize
      );

    /*
     * If the item is already in the cart,
     * DO NOT add it again.
     *
     * The customer must change the quantity
     * manually if they want more than one.
     */
    if (!existingCartItem) {
      const addedToCart = await addItem({
        productId: product.id,

        variantId: selectedVariant.id,

        name: product.name,

        variantName: selectedVariant.name,

        category: product.category,

        image:
          product.images.find(
            (image) => image.isPrimary
          )?.url ??
          product.images[0]?.url,

        price,

        stock,

        gauge: "18 Gauge",

        size: customSize
          ? undefined
          : selectedVariant.size ??
            undefined,

        finish:
          selectedVariant.finish ??
          undefined,

        customSize,

        measurements: customSize
          ? measurementValues
          : undefined,

        quantity,
      });
    }

    router.push("/checkout");
  } catch (error) {
    console.error(
      "BUY NOW ERROR:",
      error
    );

    alert(
      "Unable to continue to checkout."
    );
  }
}
async function handleAddToCart() {
  if (!loggedIn) {
    router.push(
      "/account/login?redirect=" +
        encodeURIComponent(
          window.location.pathname
        )
    );
    return;
  }

    if (!selectedVariant) {
      alert(
        "Please select a valid product variant."
      );
      return;
    }

    if (stock <= 0) {
      alert(
        "This variant is currently out of stock."
      );
      return;
    }

    if (quantity > stock) {
      alert(
        "The selected quantity is greater than available stock."
      );
      return;
    }

    /*
     * For custom sizing, make sure
     * at least the important measurements
     * are provided.
     */
    if (customSize) {
      const requiredMeasurements = [
        "height",
        "chest",
        "waist",
      ];

      const missing =
        requiredMeasurements.some(
          (field) =>
            !measurementValues[field]
        );

      if (missing) {
        alert(
          "Please enter Height, Chest and Waist measurements."
        );
        return;
      }
    }

    const addedToCart = await addItem({
      productId: product.id,
      

      /*
       * IMPORTANT:
       * This is the exact selected
       * ProductVariant ID.
       */
      variantId: selectedVariant.id,

      name: product.name,

variantName:
  selectedVariant.name,

      category: product.category,

      image: product.images.find((image) => image.isPrimary)?.url ?? product.images[0]?.url,

      price,
      stock,

      gauge: "18 Gauge",

      size: customSize
        ? undefined
        : selectedVariant.size ??
          undefined,

      finish:
        selectedVariant.finish ??
        undefined,

      customSize,

      measurements: customSize
        ? measurementValues
        : undefined,

      quantity,
    });

    if (addedToCart) {
      await loadBasketCount();
    }

    alert("Added to cart!");
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      {/* Header */}

      <StoreHeader />

      {/* Product */}

      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:gap-10">
          {/* IMAGE GALLERY */}

          <div>
            <ProductImageCarousel
              images={product.images}
              productName={product.name}
              category={product.category}
            />
          </div>

          {/* PRODUCT INFORMATION */}

          <div className="lg:pt-2">
            <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
              {product.category}
            </p>

            <h1 className="mt-3 font-serif text-2xl font-semibold leading-tight sm:text-3xl lg:text-[32px]">
              {product.name}
            </h1>

            {(product.brand || product.model) && <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">{product.brand && <span><strong className="text-slate-800">Brand:</strong> {product.brand}</span>}{product.model && <span><strong className="text-slate-800">Model:</strong> {product.model}</span>}</div>}
            {specificationEntries.length > 0 && <section className="mt-6 border border-slate-200 bg-white p-4"><h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-sky-800">Technical Specifications</h2><dl className="divide-y divide-slate-100">{specificationEntries.map(([key, value]) => <div key={key} className="grid grid-cols-2 gap-3 py-2 text-sm"><dt className="text-slate-500">{key}</dt><dd className="font-medium text-slate-900">{String(value)}</dd></div>)}</dl></section>}

            {/* Rating */}

            <div className="mt-3 flex items-center gap-3">

              <div
                className="flex items-center gap-1 leading-none"
                aria-label="Product rating"
              >
                {Array.from({ length: 5 }).map((_, index) => {
                  const averageRating =
                    product.reviews.length > 0
                      ? product.reviews.reduce(
                          (sum, review) =>
                            sum + review.rating,
                          0
                        ) / product.reviews.length
                      : 0;

                  return (
                    <span
                      key={index}
                      className={
                        index < Math.round(averageRating)
                          ? "text-[#0877b9]"
                          : "text-[#4a4439]"
                      }
                      style={{
                        fontSize: "18px",
                        lineHeight: 1
                      }}
                    >
                      {index < Math.round(averageRating)
                        ? String.fromCharCode(9733)
                        : String.fromCharCode(9734)}
                    </span>
                  );
                })}
              </div>

              {product.reviews.length > 0 ? (
                <>
                  <span className="text-sm font-medium text-[#17212b]">
                    {(
                      product.reviews.reduce(
                        (sum, review) =>
                          sum + review.rating,
                        0
                      ) / product.reviews.length
                    ).toFixed(1)}
                  </span>

                  <span className="text-sm text-[#777064]">
                    ({product.reviews.length}{" "}
                    {product.reviews.length === 1
                      ? "review"
                      : "reviews"})
                  </span>
                </>
              ) : (
                <span className="text-sm text-[#777064]">
                  No reviews yet
                </span>
              )}

            </div>
            {/* Price */}

            <div className="mt-6">
              {hasDiscount && (
                <div className="mt-1 text-base font-normal text-[#475569] line-through">
                  {formatCurrency(
                    originalPrice,
                    currency,
                    rates
                  )}
                </div>
              )}
              <div className="text-3xl font-semibold text-[#0877b9]">
                {formatCurrency(
                  displayPrice,
                  currency,
                  rates
                )}
              </div>

              {!hasDiscount && displayCompareAtPrice && originalPrice > price + 0.009 && (
                <div className="mt-1 text-base font-normal text-[#475569] line-through">
                  {formatCurrency(originalPrice, currency, rates)}
                </div>
              )}
            </div>

            {basketCount > 0 && (
              <div className="mt-4 flex items-center gap-2 text-base font-bold uppercase tracking-wide text-red-600">
                <span aria-hidden="true" className="text-lg">
                  🛒
                </span>
                <span>
                  {basketCount === 1
                    ? "1 person has this item in their basket"
                    : `${basketCount} people have this item in their basket`}
                </span>
              </div>
            )}
            <div className="my-8 h-px bg-[#332d24]" />

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#0369a1]">
                  Product Description
                </h2>

                <span className="text-[9px] uppercase tracking-[0.12em] text-[#625c53]">
                  Scroll to read
                </span>
              </div>

              <div className="max-h-[420px] overflow-y-auto border border-[#e2e8f0] bg-[#ffffff] p-5 pr-4 [scrollbar-width:thin]">
                <p className="text-sm leading-7 text-[#475569] sm:text-base sm:leading-8">
                  {product.description}
                </p>
              </div>
            </div>

           {/* Product Configuration */}

            <div className="mt-9">

              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.15em]">
                  Choose Configuration
                </span>

                <span className="text-xs uppercase tracking-[0.12em] text-[#777064]">
                  Required
                </span>
              </div>

              <div className="relative">

                <select
                  value={selectedVariantId}
                  onChange={(event) =>
                    handleVariantChange(event.target.value)
                  }
                  className="w-full appearance-none border border-[#cbd5e1] bg-[#ffffff] px-5 py-4 pr-12 text-sm text-[#17212b] outline-none transition focus:border-[#0284c7] hover:border-[#6b5b42]"
                >
                  <option value="" disabled>
                    Select Configuration
                  </option>

                  {product.variants.map((variant) => {
                    const available = variant.stock > 0;

                    return (
                      <option
                        key={variant.id}
                        value={variant.id}
                        disabled={!available}
                      >
                        {variant.name}
                        {variant.size
                          ? ` - ${variant.size}`
                          : ""}
                        {" - "}
                        {formatCurrency(Number(variant.price) * (1 - discountRate / 100), currency, rates)}
                        {!available
                          ? " - Out of Stock"
                          : ""}
                      </option>
                    );
                  })}
                </select>

                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0877b9]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="m6 9 6 6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

              </div>

              {selectedVariant && (
                <div className="mt-3 flex items-center justify-between border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">

                  <div>
                    <p className="text-sm font-semibold text-[#17212b]">
                      {selectedVariant.name}
                    </p>

                    {selectedVariant.size && (
                      <p className="mt-1 text-xs text-[#777064]">
                        {selectedVariant.size}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#0877b9]">
                      {formatCurrency(Number(selectedVariant.price) * (1 - discountRate / 100), currency, rates)}
                    </p>

                    <p
                      className={`mt-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                        selectedVariant.stock > 0
                          ? "text-[#777064]"
                          : "text-[#d79b8d]"
                      }`}
                    >
                      {selectedVariant.stock > 0
                        ? "Available"
                        : "Out of stock"}
                    </p>
                  </div>

                </div>
              )}

              {/* Purchase Options */}

              <div className="mt-9">

                {/* Quantity */}

                <div>
                  <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.15em]">
                    Quantity
                  </span>

                  <div className="flex w-fit items-center border border-[#cbd5e1] bg-[#ffffff]">

                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={
                        !selectedVariant ||
                        quantity <= 1
                      }
                      className="flex h-12 w-12 items-center justify-center text-xl text-[#17212b] transition hover:bg-[#211b13] disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>

                    <span className="flex h-12 min-w-14 items-center justify-center border-x border-[#cbd5e1] text-sm font-semibold text-[#17212b]">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={
                        !selectedVariant ||
                        quantity >= stock
                      }
                      className="flex h-12 w-12 items-center justify-center text-xl text-[#17212b] transition hover:bg-[#211b13] disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>

                  </div>

                  <p className="mt-3 text-xs text-[#777064]">
                    {stock > 0
                      ? `${stock} available`
                      : "Currently unavailable"}
                  </p>
                </div>

                {/* Add To Cart */}

                <button
                  type="button"
                  disabled={
                    !selectedVariant ||
                    stock <= 0
                  }
                  onClick={handleAddToCart}
                  className="group mt-7 flex w-full items-center justify-center gap-3 border border-[#0284c7] bg-[#0877b9] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#ffffff] transition duration-200 hover:bg-[#075985] disabled:cursor-not-allowed disabled:border-[#4a4439] disabled:bg-[#4a4439] disabled:text-[#81796d]"
                >
                  {stock > 0 ? (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6"
                        />
                        <circle cx="10" cy="20" r="1.2" />
                        <circle cx="18" cy="20" r="1.2" />
                      </svg>

                      <span>Add to Cart</span>
                    </>
                  ) : (
                    <span>Out of Stock</span>
                  )}
                </button>

                {/* Buy Now */}

                <button
                  type="button"
                  disabled={
                    !selectedVariant ||
                    stock <= 0
                  }
                  onClick={handleBuyNow}
                  className="group mt-3 flex w-full items-center justify-center gap-3 border border-[#cbd5e1] bg-transparent px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#17212b] transition duration-200 hover:border-[#0284c7] hover:bg-[#f3eee4] hover:text-[#0877b9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"
                    />
                  </svg>

                  <span>Buy Now</span>
                </button>

              </div>

              {/* Product Features - bottom */}

              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#e2e8f0] pt-6 text-center text-[10px] uppercase tracking-[0.12em] text-[#777064]">

                <div>
                  <span className="mb-1 block text-[#0877b9]">
                    Handcrafted
                  </span>
                  Historical-inspired workmanship
                </div>

                <div>
                  <span className="mb-1 block text-[#0877b9]">
                    Custom Available
                  </span>
                  Selected products
                </div>

              </div>

            </div>
            {/* Write a Review */}
            <div className="mb-8 border border-[#e2e8f0] bg-[#ffffff] p-6">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#0369a1]">
                  Customer Reviews
                </p>

                <h3 className="mt-2 font-serif text-2xl font-bold text-[#17212b]">
                  Share Your Experience
                </h3>
              </div>

              {!loggedIn ? (
                <div className="border border-[#e2e8f0] bg-[#f8fafc] p-5">
                  <p className="text-sm text-[#475569]">
                    Please log in to write a review.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/account/login?redirect=" +
                          encodeURIComponent(window.location.pathname)
                      )
                    }
                    className="mt-4 border border-[#cbd5e1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#0877b9] transition hover:border-[#0284c7] hover:bg-[#f3eee4]"
                  >
                    Log In to Review
                  </button>
                </div>
              ) : (
                <div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#0369a1]">
                      Your Rating
                    </label>

                    <div className="mt-3 flex gap-2">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const rating = index + 1;

                        return (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setReviewRating(rating)}
                            className="text-3xl leading-none transition hover:scale-110"
                            aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
                          >
                            <span
                              className={
                                rating <= reviewRating
                                  ? "text-[#0877b9]"
                                  : "text-[#475569]"
                              }
                            >
                              {String.fromCharCode(
                                rating <= reviewRating ? 9733 : 9734
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="reviewTitle"
                      className="block text-xs uppercase tracking-[0.15em] text-[#0369a1]"
                    >
                      Review Title
                    </label>

                    <input
                      id="reviewTitle"
                      type="text"
                      value={reviewTitle}
                      onChange={(event) =>
                        setReviewTitle(event.target.value)
                      }
                      maxLength={120}
                      placeholder="Give your review a title"
                      className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-sm text-[#17212b] outline-none focus:border-[#0284c7]"
                    />
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="reviewComment"
                      className="block text-xs uppercase tracking-[0.15em] text-[#0369a1]"
                    >
                      Your Review
                    </label>

                    <textarea
                      id="reviewComment"
                      value={reviewComment}
                      onChange={(event) =>
                        setReviewComment(event.target.value)
                      }
                      rows={5}
                      maxLength={2000}
                      placeholder="Tell us about your experience with this product..."
                      className="mt-2 w-full resize-none border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-sm leading-6 text-[#17212b] outline-none focus:border-[#0284c7]"
                    />
                  </div>

                  {reviewError && (
                    <p className="mt-4 text-sm text-[#d98b7b]">
                      {reviewError}
                    </p>
                  )}

                  {reviewMessage && (
                    <p className="mt-4 text-sm text-[#8fbf7f]">
                      {reviewMessage}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleReviewSubmit}
                    disabled={reviewSubmitting}
                    className="mt-5 border border-[#cbd5e1] bg-[#f3eee4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#0877b9] transition hover:border-[#0284c7] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              )}
            </div>
            {product.reviews.length === 0 ? (

              <div className="border border-[#e2e8f0] bg-[#ffffff] px-6 py-12 text-center">

                <div className="flex justify-center gap-1 text-3xl leading-none text-[#475569]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index}>
                      {String.fromCharCode(9734)}
                    </span>
                  ))}
                </div>

                <p className="mt-4 font-serif text-xl text-[#475569]">
                  No reviews yet
                </p>

                <p className="mt-2 text-sm text-[#777064]">
                  Be the first customer to review this piece.
                </p>

              </div>

            ) : (

              <div className="grid gap-5 md:grid-cols-2">

                {product.reviews.map((review) => (

                  <article
                    key={review.id}
                    className="border border-[#e2e8f0] bg-[#ffffff] p-6 transition hover:border-[#cbd5e1]"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <div className="flex items-center gap-1 text-lg leading-none">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <span
                              key={index}
                              className={
                                index < review.rating
                                  ? "text-[#0877b9]"
                                  : "text-[#475569]"
                              }
                            >
                              {String.fromCharCode(
                                index < review.rating
                                  ? 9733
                                  : 9734
                              )}
                            </span>
                          ))}
                        </div>

                        {review.title && (
                          <h3 className="mt-3 text-base font-semibold text-[#17212b]">
                            {review.title}
                          </h3>
                        )}

                      </div>

                      <time
                        dateTime={review.createdAt}
                        className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-[#625c53]"
                      >
                        {new Date(
                          review.createdAt
                        ).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </time>

                    </div>

                    {review.comment && (
                      <p className="mt-5 text-sm leading-7 text-[#475569]">
                        {review.comment}
                      </p>
                    )}

                    <div className="mt-6 border-t border-[#e2e8f0] pt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6f685e]">
                      Verified Customer Review
                    </div>

                  </article>

                ))}

              </div>

            )}

          </div>
        

        </div></section>

      <ProductVideoGallery
        videos={product.videos}
        poster={product.images.find((image) => image.isPrimary)?.url ?? product.images[0]?.url}
        productName={product.name}
      />

      </main>
  );
}















