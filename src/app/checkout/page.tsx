"use client";
import CurrencySelector from "@/components/currency/CurrencySelector";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";

import Script from "next/script";
import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { formatCurrency } from "@/lib/currency";
type PaymentMethod = "RAZORPAY" | "PAYPAL" | "WISE" | "PAYONEER";
declare global {
  interface Window {
    Razorpay: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      handler: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => void;
      prefill?: {
        name?: string;
        email?: string;
        contact?: string;
      };
      theme?: {
        color?: string;
      };
      modal?: {
        ondismiss?: () => void;
      };
    }) => {
      open: () => void;
    };
  }
}

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("PAYPAL");

  const { currency, rates } = useCurrency();
  const paypalCurrency = currency === "INR" ? "USD" : currency;
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const {
  items,
  subtotal,
  clearCart,
  loading: cartLoading,
  loggedIn,
} = useCart();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [placingOrder, setPlacingOrder] = useState(false);
  const [paypalError, setPaypalError] = useState("");
  const [paypalStatus, setPaypalStatus] = useState("");
  const checkoutFormRef = useRef<HTMLFormElement>(null);
  const paypalOperationRef = useRef(false);
  const paypalCompletionRef = useRef(false);
const [indiaTaxRate, setIndiaTaxRate] =
  useState(17);

const [internationalTaxRate, setInternationalTaxRate] =
  useState(0);

const [freeShipping, setFreeShipping] = useState(true); const [discountSettings, setDiscountSettings] = useState({discountIndia:0,discountUnitedKingdom:0,discountGermany:0,discountFrance:0,discountItaly:0,discountBelgium:0,discountSpain:0,discountSwitzerland:0,discountUnitedStates:0,discountEverywhere:0}); const [customerCountry, setCustomerCountry] = useState("");
useEffect(() => {
  if (cartLoading) {
    return;
  }

  if (!loggedIn) {
    const currentPath =
      window.location.pathname +
      window.location.search;

    window.location.href =
      `/account/login?redirect=${encodeURIComponent(
        currentPath
      )}`;

    return;
  }

  if (items.length === 0 && !placingOrder) {
  window.location.href = "/cart";
}
}, [
  cartLoading,
  loggedIn,
  items.length,
  placingOrder,
]);
useEffect(() => {
  async function loadStoreSettings() {
    try {
      const response = await fetch(
        "/api/store-settings"
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load store settings."
        );
      }

      const data =
        await response.json();

      setIndiaTaxRate(
        Number(data.indiaTaxRate)
      );

      setInternationalTaxRate(
        Number(
          data.internationalTaxRate
        )
      );

      setFreeShipping(
        Boolean(data.freeShipping)
      );

      setDiscountSettings({
        discountIndia: Number(data.discountIndia) || 0,
        discountUnitedKingdom: Number(data.discountUnitedKingdom) || 0,
        discountGermany: Number(data.discountGermany) || 0,
        discountFrance: Number(data.discountFrance) || 0,
        discountItaly: Number(data.discountItaly) || 0,
        discountBelgium: Number(data.discountBelgium) || 0,
        discountSpain: Number(data.discountSpain) || 0,
        discountSwitzerland: Number(data.discountSwitzerland) || 0,
        discountUnitedStates: Number(data.discountUnitedStates) || 0,
        discountEverywhere: Number(data.discountEverywhere) || 0,
      });
    } catch (error) {
      console.error(
        "STORE SETTINGS LOAD ERROR:",
        error
      );
    }
  }

  loadStoreSettings(); }, []); useEffect(() => { async function loadCustomerCountry() { try { const response = await fetch("/api/account/country"); if (!response.ok) throw new Error("Unable to load customer country."); const data = await response.json(); const registeredCountry = String(data.country || "").trim(); setCustomerCountry(registeredCountry); setForm((current) => ({ ...current, country: registeredCountry })); } catch (error) { console.error("CUSTOMER COUNTRY LOAD ERROR:", error); } } if (loggedIn) loadCustomerCountry(); }, [loggedIn]);

const normalizedCustomerCountry = customerCountry.trim().toUpperCase(); const isIndia = normalizedCustomerCountry === "INDIA" || normalizedCustomerCountry === "IN"; const taxRate = isIndia ? indiaTaxRate : internationalTaxRate; const discountMap: Record<string, number> = { "UNITED KINGDOM": discountSettings.discountUnitedKingdom, "UK": discountSettings.discountUnitedKingdom, "GERMANY": discountSettings.discountGermany, "FRANCE": discountSettings.discountFrance, "ITALY": discountSettings.discountItaly, "BELGIUM": discountSettings.discountBelgium, "SPAIN": discountSettings.discountSpain, "SWITZERLAND": discountSettings.discountSwitzerland, "UNITED STATES": discountSettings.discountUnitedStates, "US": discountSettings.discountUnitedStates, "USA": discountSettings.discountUnitedStates }; const discountRate = isIndia ? discountSettings.discountIndia : (discountMap[normalizedCustomerCountry] ?? discountSettings.discountEverywhere); const discount = subtotal * (discountRate / 100); const discountedSubtotal = subtotal - discount; const shippingCost = freeShipping ? 0 : 0; const tax = (discountedSubtotal + shippingCost) * (taxRate / 100); const total = discountedSubtotal + shippingCost + tax;
  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handlePlaceOrder(
    event: React.FormEvent
  ) {
    event.preventDefault();

    /*
     * PayPal is handled by PayPalButtons below.
     * This submit handler is therefore only for
     * Razorpay and the future manual payment methods.
     */
    if (paymentMethod === "PAYPAL") {
      setPaypalError("Use the PayPal button below to continue securely.");
      return;
    }

    if (paymentMethod !== "RAZORPAY") {
      alert(
        paymentMethod === "WISE"
          ? "Wise payment will be available soon."
          : "Payoneer payment will be available soon."
      );
      return;
    }

    setPlacingOrder(true);

    try {
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        throw new Error("Razorpay is not configured. Please contact the store.");
      }

      /*
       * Create Razorpay order using
       * server-side product prices.
       */
      const createOrderResponse =
        await fetch(
          "/api/payments/razorpay/create-order",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              items,
              country: form.country,
            }),
          }
        );

      const createOrderData =
        await createOrderResponse.json();

      if (!createOrderResponse.ok) {
        throw new Error(
          createOrderData.error ||
            "Unable to start payment."
        );
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout failed to load. Please refresh the page and try again."
        );
      }

      const razorpay =
        new window.Razorpay({
          key: razorpayKeyId,
          amount:
            createOrderData.amount,
          currency:
            createOrderData.currency,
          name: "Industrial Automation",
          description:
            "Industrial Automation Order",
          order_id:
            createOrderData.orderId,

          prefill: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            contact: form.phone,
          },

          theme: {
            color: "#0284c7",
          },

          modal: {
            ondismiss: () => {
              setPlacingOrder(false);
            },
          },

          handler: async (
            paymentResponse
          ) => {
            try {
              const response =
                await fetch(
                  "/api/payments/razorpay/complete-order",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type":
                        "application/json",
                    },
                    body: JSON.stringify({
                      customer: form,
                      items,

                      razorpayOrderId:
                        paymentResponse.razorpay_order_id,

                      razorpayPaymentId:
                        paymentResponse.razorpay_payment_id,

                      razorpaySignature:
                        paymentResponse.razorpay_signature,
                    }),
                  }
                );

              const data =
                await response.json();

              if (!response.ok) {
                throw new Error(
                  data.error ||
                    "Payment verification failed."
                );
              }

              clearCart();

              window.location.href =
                `/order-confirmation/${data.orderNumber}`;
            } catch (error) {
              console.error(
                "PAYMENT COMPLETION ERROR:",
                error
              );

              alert(
                error instanceof Error
                  ? error.message
                  : "Payment completed, but we could not complete your order. Please contact us."
              );

              setPlacingOrder(false);
            }
          },
        });

      razorpay.open();
    } catch (error) {
      console.error(
        "RAZORPAY CHECKOUT ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to start payment."
      );

      setPlacingOrder(false);
    }
  }
  if (cartLoading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm uppercase tracking-[0.25em] text-[#0369a1]">
            Loading...
          </p>
        </div>
        <SiteFooter />
    </main>
    );
  }

  if (!loggedIn) {
    return null;
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
          <h1 className="font-serif text-5xl font-bold">
            YOUR CART IS EMPTY
          </h1>

          <p className="mt-5 text-[#475569]">
            Add something to your cart before proceeding
            to checkout.
          </p>

          <Link
            href="/"
            className="mt-8 bg-[#0877b9] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#ffffff]"
          >
            Continue Shopping
          </Link>
        </div>
        <SiteFooter />
    </main>
    );
  }

  return (
    <>
    <Script
  src="https://checkout.razorpay.com/v1/checkout.js"
/>
    
    
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <StoreHeader />

      <section className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
            Complete your order
          </p>

          <h1 className="mt-3 font-serif text-5xl font-bold">
            CHECKOUT
          </h1>
        </div>

        <form
          ref={checkoutFormRef}
          onSubmit={handlePlaceOrder}
          className="grid gap-12 lg:grid-cols-[1fr_400px]"
        >
          {/* Customer Details */}
          <div className="space-y-10">
            <section>
              <h2 className="font-serif text-3xl font-bold">
                Customer Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field
                  label="First Name"
                  required
                  value={form.firstName}
                  onChange={(value) =>
                    updateField("firstName", value)
                  }
                />

                <Field
                  label="Last Name"
                  required
                  value={form.lastName}
                  onChange={(value) =>
                    updateField("lastName", value)
                  }
                />

                <Field
                  label="Email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(value) =>
                    updateField("email", value)
                  }
                />

                <Field
                  label="Phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(value) =>
                    updateField("phone", value)
                  }
                />
              </div>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-bold">
                Shipping Address
              </h2>

              <div className="mt-6 space-y-5">
                <Field
                  label="Address"
                  required
                  value={form.address1}
                  onChange={(value) =>
                    updateField("address1", value)
                  }
                />

                <Field
                  label="Apartment, Suite, etc. (Optional)"
                  value={form.address2}
                  onChange={(value) =>
                    updateField("address2", value)
                  }
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="City"
                    required
                    value={form.city}
                    onChange={(value) =>
                      updateField("city", value)
                    }
                  />

                  <Field
                    label="State / Province"
                    required
                    value={form.state}
                    onChange={(value) =>
                      updateField("state", value)
                    }
                  />

                  <Field
                    label="Postal Code"
                    required
                    value={form.postalCode}
                    onChange={(value) =>
                      updateField(
                        "postalCode",
                        value
                      )
                    }
                  />

                  <Field
                    label="Country"
                    required
                    value={form.country}
                    onChange={(value) =>
                      updateField("country", value)
                    }
                  />
                </div>
              </div>
            </section>

            <section className="border border-[#cbd5e1] bg-[#ffffff] p-6">
  <h2 className="font-serif text-2xl font-bold">
    Payment
  </h2>

  <p className="mt-3 text-sm leading-6 text-[#475569]">
    Choose your preferred payment method.
  </p>

  <div className="mt-6 space-y-3">

    {/* PayPal */}
    <label
      className={`block cursor-pointer border p-4 transition focus-within:ring-2 focus-within:ring-[#0284c7] focus-within:ring-offset-2 ${
        paymentMethod === "PAYPAL"
          ? "border-[#0284c7] bg-[#f1f5f9]"
          : "border-[#cbd5e1] hover:border-[#bda477]"
      }`}
    >
      <div className="flex items-center gap-4">
        <input
          type="radio"
          name="paymentMethod"
          value="PAYPAL"
          checked={paymentMethod === "PAYPAL"}
          onChange={() => { setPaymentMethod("PAYPAL"); setPaypalError(""); setPaypalStatus(""); }}
          aria-label="Pay with PayPal"
          className="h-4 w-4 shrink-0 accent-[#0877b9]"
        />

        <PaymentBrandIcon method="PAYPAL" />
        <div className="min-w-0">
          <div className="font-semibold text-[#17212b]">
            PayPal
          </div>

          <p className="mt-1 text-xs leading-5 text-[#475569]">
            Pay securely using your PayPal account or
            eligible payment methods available through PayPal.
          </p>
        </div>
      </div>
    </label>

    {/* Razorpay */}
    <label
      className={`block cursor-pointer border p-4 transition focus-within:ring-2 focus-within:ring-[#0284c7] focus-within:ring-offset-2 ${
        paymentMethod === "RAZORPAY"
          ? "border-[#0284c7] bg-[#f1f5f9]"
          : "border-[#cbd5e1] hover:border-[#bda477]"
      }`}
    >
      <div className="flex items-center gap-4">
        <input
          type="radio"
          name="paymentMethod"
          value="RAZORPAY"
          checked={paymentMethod === "RAZORPAY"}
          onChange={() => { setPaymentMethod("RAZORPAY"); setPaypalError(""); setPaypalStatus(""); }}
          aria-label="Pay by card with Razorpay"
          className="h-4 w-4 shrink-0 accent-[#0877b9]"
        />

        <PaymentBrandIcon method="RAZORPAY" />
        <div className="min-w-0">
          <div className="font-semibold text-[#17212b]">
            Card / Razorpay
          </div>

          <p className="mt-1 text-xs leading-5 text-[#475569]">
            Pay securely with cards and other payment methods enabled for this store.
          </p>
        </div>
      </div>
    </label>

    {/* Wise option retained for a future setup. */}
    {/* <label
      className={`block cursor-pointer border p-4 transition ${
        paymentMethod === "WISE"
          ? "border-[#0284c7] bg-[#f1f5f9]"
          : "border-[#cbd5e1] hover:border-[#bda477]"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="radio"
          name="paymentMethod"
          value="WISE"
          checked={paymentMethod === "WISE"}
          onChange={() => setPaymentMethod("WISE")}
          className="mt-1"
        />

        <div>
          <div className="font-semibold">
            Wise Bank Transfer
          </div>

          <p className="mt-1 text-xs leading-5 text-[#475569]">
            Place your order and receive Wise payment
            instructions. The order will be processed after
            payment is confirmed.
          </p>
        </div>
      </div>
    </label> */}

    {/* Payoneer option retained for a future setup. */}
    {/* <label
      className={`block cursor-pointer border p-4 transition ${
        paymentMethod === "PAYONEER"
          ? "border-[#0284c7] bg-[#f1f5f9]"
          : "border-[#cbd5e1] hover:border-[#bda477]"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="radio"
          name="paymentMethod"
          value="PAYONEER"
          checked={paymentMethod === "PAYONEER"}
          onChange={() => setPaymentMethod("PAYONEER")}
          className="mt-1"
        />

        <div>
          <div className="font-semibold">
            Payoneer
          </div>

          <p className="mt-1 text-xs leading-5 text-[#475569]">
            Place your order and receive Payoneer payment
            instructions. The order will be processed after
            payment is confirmed.
          </p>
        </div>
      </div>
    </label> */}

  </div>

  {paymentMethod === "RAZORPAY" && (
    <p className="mt-4 text-sm leading-6 text-[#475569]">
      Razorpay payments are charged in INR. Estimated charge: {formatCurrency(total, "INR", rates)}. The final amount is calculated when payment starts.
    </p>
  )}

  {/* PayPal Checkout */}
  {paymentMethod === "PAYPAL" && (
    <div className="mt-6 border border-[#cbd5e1] bg-[#f3eee4] p-5">
      <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[#0369a1]">
        PayPal Secure Checkout
      </p>
      {currency === "INR" && <p className="mb-4 text-sm text-slate-700">PayPal processes this order in USD: {formatCurrency(total, "USD", rates)}.</p>}

      {paypalClientId ? <PayPalScriptProvider
        key={paypalCurrency}
        options={{
          clientId: paypalClientId,
          currency: paypalCurrency,
          intent: "capture",
        }}
      >
        <PayPalButtons
          style={{
            layout: "vertical",
            shape: "rect",
            label: "paypal",
          }}
          disabled={placingOrder || items.length === 0}
          createOrder={async () => {
            if (paypalOperationRef.current) {
              throw new Error("PayPal checkout is already in progress.");
            }
            if (!checkoutFormRef.current?.reportValidity()) {
              const message = "Complete the required customer and shipping fields before paying.";
              setPaypalError(message);
              throw new Error(message);
            }

            paypalOperationRef.current = true;
            paypalCompletionRef.current = false;
            setPaypalError("");
            setPaypalStatus("Preparing secure PayPal checkout…");
            setPlacingOrder(true);

            try {


              const response = await fetch(
                "/api/payments/paypal/create-order",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    currency: paypalCurrency,
                  }),
                }
              );

              const data = await response.json();

              if (!response.ok || !data.orderID) {
                throw new Error(
                  data.error ||
                    "Unable to create PayPal order."
                );
              }

              return data.orderID;
            } catch (error) {
              console.error(
                "PAYPAL CREATE ORDER ERROR:",
                error
              );

              setPlacingOrder(false);
              paypalOperationRef.current = false;
              setPaypalStatus("");
              setPaypalError(error instanceof Error ? error.message : "Unable to create PayPal order.");
              throw error;
            }
          }}
          onApprove={async (data) => {
            if (paypalCompletionRef.current) return;
            paypalCompletionRef.current = true;
            setPaypalStatus("Verifying payment and placing your order…");
            try {
              if (!data.orderID) {
                throw new Error(
                  "PayPal order ID was not returned."
                );
              }

              const response = await fetch(
                "/api/payments/paypal/complete-order",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    customer: form,
                    items,
                    orderID: data.orderID,
                    currency: paypalCurrency,
                  }),
                }
              );

              const result = await response.json();

              if (!response.ok) {
                throw new Error(
                  result.error ||
                    "PayPal payment verification failed."
                );
              }

              clearCart();

              window.location.href =
                `/order-confirmation/${result.orderNumber}`;
            } catch (error) {
              console.error(
                "PAYPAL COMPLETION ERROR:",
                error
              );

              setPaypalError(error instanceof Error
                ? error.message
                : "PayPal payment completed, but we could not complete your order. Please contact us.");
              setPlacingOrder(false);
              paypalOperationRef.current = false;
              paypalCompletionRef.current = false;
              setPaypalStatus("");
            }
          }}
          onCancel={() => {
            setPlacingOrder(false);
            paypalOperationRef.current = false;
            paypalCompletionRef.current = false;
            setPaypalStatus("");
            setPaypalError("Payment cancelled. Your cart is unchanged.");
          }}
          onError={(error) => {
            console.error(
              "PAYPAL CHECKOUT ERROR:",
              error
            );

            setPaypalError(error instanceof Error ? error.message : "Unable to complete PayPal payment. Please try again.");
            setPlacingOrder(false);
            paypalOperationRef.current = false;
            paypalCompletionRef.current = false;
            setPaypalStatus("");
          }}
        />
      </PayPalScriptProvider> : <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">PayPal is temporarily unavailable. Please choose another payment method.</p>}
      {paypalStatus && <p className="mt-3 text-sm text-[#475569]" role="status" aria-live="polite">{paypalStatus}</p>}
      {paypalError && <p className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">{paypalError}</p>}
    </div>
  )}
</section>

            {paymentMethod !== "PAYPAL" && <button
              type="submit"
              disabled={placingOrder}
              className="w-full bg-[#0877b9] px-8 py-5 text-sm font-bold uppercase tracking-[0.2em] text-[#ffffff] transition hover:bg-[#075985] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placingOrder
                ? "Placing Order..."
                : "Place Order"}
            </button>}
          </div>

          {/* Order Summary */}
          <aside className="h-fit border border-[#cbd5e1] bg-[#ffffff] p-7 lg:sticky lg:top-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#0369a1]">
              Your Order
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold">
              ORDER SUMMARY
            </h2>

            <div className="my-7 space-y-6">
              {items.map((item) => (
  <div
    key={item.cartItemId}
    className="flex gap-4 border-b border-[#e2e8f0] pb-5 last:border-b-0"
  >
    <div className="h-24 w-24 shrink-0 overflow-hidden border border-[#e2e8f0] bg-[#ffffff]">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-xs uppercase text-[#777064]">
          PRODUCT
        </div>
      )}
    </div>

    <div className="min-w-0 flex-1">
      <p className="font-semibold">
        {item.name}
      </p>

      {item.variantName && (
        <p className="mt-1 text-sm font-semibold text-[#0877b9]">
          {item.variantName}
        </p>
      )}

      {item.gauge && (
        <p className="mt-2 text-xs text-[#475569]">
          Gauge: {item.gauge}
        </p>
      )}

      {item.size && (
        <p className="text-xs text-[#475569]">
          Size: {item.size}
        </p>
      )}

      {item.finish && (
        <p className="text-xs text-[#475569]">
          Finish: {item.finish}
        </p>
      )}

      {item.customSize && (
        <p className="mt-1 text-xs text-[#0877b9]">
          Custom Size
        </p>
      )}

      <p className="mt-2 text-xs text-[#777064]">
        Qty: {item.quantity}
      </p>
    </div>

    <div className="shrink-0 text-right font-semibold text-[#0877b9]">
      {formatCurrency(item.price * item.quantity, currency, rates)}
    </div>
  </div>
))}
            </div>

            <div className="h-px bg-[#332d24]" />

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between text-[#475569]">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, currency, rates)}</span>
              </div>

              <div className="flex justify-between text-[#475569]">
                <span>
                  Discount
                  {discountRate > 0 ? ` (${discountRate}%)` : ""}
                </span>
                <span>
                  {discountRate > 0 ? `-${formatCurrency(discount, currency, rates)}` : formatCurrency(0, currency, rates)}
                </span>
              </div>

              <div className="flex justify-between text-[#475569]">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between text-[#475569]">
                <span>
                  Tax
                  {taxRate > 0 ? ` (${taxRate}%)` : ""}
                </span>
                <span>{formatCurrency(tax, currency, rates)}</span>
              </div>
            </div>
              <div className="my-6 h-px bg-[#332d24]" />

            <div className="flex justify-between">
              <span className="font-serif text-xl font-bold">
                Total
              </span>
              <span className="text-2xl font-bold text-[#0877b9]">
                {formatCurrency(total, currency, rates)}
              </span>
            </div>

          </aside>
        </form>
      </section>
      <SiteFooter />
    </main>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#475569]">
        {label}
        {required && (
          <span className="ml-1 text-[#0877b9]">*</span>
        )}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-[#cbd5e1] bg-[#ffffff] px-4 py-3 text-[#17212b] outline-none transition focus:border-[#0284c7]"
      />
    </label>
  );
}

function PaymentBrandIcon({ method }: { method: "PAYPAL" | "RAZORPAY" }) {
  if (method === "PAYPAL") {
    return (
      <span className="flex h-9 w-[104px] shrink-0 items-center" aria-hidden="true">
        <svg viewBox="0 0 104 36" className="h-8 w-full" role="img">
          <path d="M13 5h11c7 0 10 4 9 10-1 7-5 11-13 11h-4l-2 7H7l5-28Zm5 15h3c3 0 5-2 5-5 0-2-1-3-4-3h-2l-2 8Z" fill="#003087" />
          <path d="M21 9h11c7 0 10 4 9 10-1 7-5 11-13 11h-4l-2 5h-7l5-26Zm5 15h3c3 0 5-2 5-5 0-2-1-3-4-3h-2l-2 8Z" fill="#009cde" />
          <text x="49" y="24" fill="#173b67" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700">PayPal</text>
        </svg>
      </span>
    );
  }

  return (
    <span className="flex h-9 w-[104px] shrink-0 items-center" aria-hidden="true">
      <svg viewBox="0 0 104 36" className="h-8 w-full" role="img">
        <path d="M8 5h13l-5 26H5l3-16-5 7 2-10 3-7Zm13 0h12L21 18l8 13H16l-7-12L21 5Z" fill="#0b72e7" />
        <text x="37" y="24" fill="#17212b" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700">Razorpay</text>
      </svg>
    </span>
  );
}

