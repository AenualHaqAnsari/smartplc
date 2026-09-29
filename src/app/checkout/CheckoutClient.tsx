"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
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
  const {
  items,
  subtotal,
  clearCart,
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
    country: "India",
  });

  const [placingOrder, setPlacingOrder] = useState(false);
const [indiaTaxRate, setIndiaTaxRate] =
  useState(17);

const [internationalTaxRate, setInternationalTaxRate] =
  useState(0);

const [freeShipping, setFreeShipping] =
  useState(true);

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
    } catch (error) {
      console.error(
        "STORE SETTINGS LOAD ERROR:",
        error
      );
    }
  }

  loadStoreSettings();
}, []);

const taxRate =
  form.country.trim().toLowerCase() === "india"
    ? indiaTaxRate
    : internationalTaxRate;

const shippingCost =
  freeShipping ? 0 : 0;

const tax =
  subtotal * (taxRate / 100);

const total =
  subtotal +
  shippingCost +
  tax;
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

  if (items.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  setPlacingOrder(true);

  try {
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

    if (
      !window.Razorpay
    ) {
      throw new Error(
        "Razorpay Checkout failed to load. Please refresh the page and try again."
      );
    }

    const razorpay =
      new window.Razorpay({
        key:
          process.env
            .NEXT_PUBLIC_RAZORPAY_KEY_ID ||
          "",
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
            /*
             * Payment completed in Razorpay.
             *
             * Now verify the payment and
             * create the actual store order.
             */
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
      </main>
    );
  }

  return (
    <>
    <Script
  src="https://checkout.razorpay.com/v1/checkout.js"
/>
    
    
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <header className="border-b border-[#e2e8f0]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-[0.12em] text-[#075985]"
          >
            INDUSTRIAL AUTOMATION
          </Link>

          <Link
            href="/cart"
            className="text-sm uppercase tracking-[0.15em] text-[#0877b9]"
          >
            â† Back to Cart
          </Link>
        </div>
      </header>

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
                Payment gateway integration will be added
                after the order system is completed.
              </p>

              <div className="mt-5 border border-dashed border-[#cbd5e1] p-5 text-center text-xs uppercase tracking-[0.15em] text-[#777064]">
                Payment Pending
              </div>
            </section>

            <button
              type="submit"
              disabled={placingOrder}
              className="w-full bg-[#0877b9] px-8 py-5 text-sm font-bold uppercase tracking-[0.2em] text-[#ffffff] transition hover:bg-[#075985] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placingOrder
                ? "Placing Order..."
                : "Place Order"}
            </button>
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
      $
      {(item.price * item.quantity).toFixed(2)}
    </div>
  </div>
))}
            </div>

            <div className="h-px bg-[#332d24]" />

            <div className="mt-6 space-y-4 text-sm">
  <div className="flex justify-between text-[#475569]">
    <span>Subtotal</span>

    <span>
      ${subtotal.toFixed(2)}
    </span>
  </div>

  <div className="flex justify-between text-[#475569]">
    <span>Shipping</span>

    <span className="text-[#0877b9]">
      FREE
    </span>
  </div>

  <div className="flex justify-between text-[#475569]">
    <span>
      Tax
      {taxRate > 0
        ? ` (${taxRate}%)`
        : ""}
    </span>

    <span>
      ${tax.toFixed(2)}
    </span>
  </div>
</div>

<div className="my-6 h-px bg-[#332d24]" />

<div className="flex justify-between">
  <span className="font-serif text-xl font-bold">
    Total
  </span>

  <span className="text-2xl font-bold text-[#0877b9]">
    ${total.toFixed(2)}
  </span>
</div>
          </aside>
        </form>
      </section>
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
      <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-[#a79d8e]">
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
        className="w-full border border-[#4a4031] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none transition focus:border-[#0284c7]"
      />
    </label>
  );
}
