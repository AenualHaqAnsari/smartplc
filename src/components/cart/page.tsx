"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
  } = useCart();

  if (items.length === 0) {
    return (
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
              href="/"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9]"
            >
              Continue Shopping
            </Link>
          </div>
        </header>

        <section className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
          <div className="text-6xl text-[#4b4439]">
            âš”
          </div>

          <h1 className="mt-7 font-serif text-5xl font-bold">
            YOUR CART IS EMPTY
          </h1>

          <p className="mt-5 max-w-lg text-[#475569]">
            Your collection awaits. Explore our handcrafted
            PLCs, HMIs, drives, sensors and industrial control components.
          </p>

          <Link
            href="/#featured"
            className="mt-9 bg-[#0877b9] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#ffffff] transition hover:bg-[#075985]"
          >
            Explore Products
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      {/* Header */}
      <header className="border-b border-[#e2e8f0]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-[0.12em] text-[#075985]"
          >
            INDUSTRIAL AUTOMATION
          </Link>

          <Link
            href="/"
            className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#dfc17d]"
          >
            Continue Shopping
          </Link>
        </div>
      </header>

      {/* Cart */}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
              Your collection
            </p>

            <h1 className="mt-3 font-serif text-5xl font-bold">
              YOUR CART
            </h1>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-sm uppercase tracking-[0.15em] text-[#475569] hover:text-[#0877b9]"
          >
            Clear Cart
          </button>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div className="space-y-5">
            {items.map((item) => (
              <article
                key={item.cartItemId}
                className="border border-[#e2e8f0] bg-[#ffffff] p-5"
              >
                <div className="flex flex-col gap-6 sm:flex-row">
                  {/* Image */}
                  <div className="h-40 w-full shrink-0 overflow-hidden bg-[#1b1814] sm:w-32">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-serif text-xs text-[#4b4439]">
                        INDUSTRIAL AUTOMATION
                      </div>
                    )}
                  </div>

                  {/* Information */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#475569]">
                          {item.category}
                        </p>

                        <h2 className="mt-2 font-serif text-2xl font-bold">
                          {item.name}
                        </h2>
                      </div>

                      <p className="text-xl font-semibold text-[#0877b9]">
                        $
                        {(item.price * item.quantity).toFixed(
                          2
                        )}
                      </p>
                    </div>

                    {/* Configuration */}
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#938b7e]">
                      {item.gauge && (
                        <span>
                          Gauge:{" "}
                          <strong className="text-[#d4cabb]">
                            {item.gauge}
                          </strong>
                        </span>
                      )}

                      {item.size && (
                        <span>
                          Size:{" "}
                          <strong className="text-[#d4cabb]">
                            {item.size}
                          </strong>
                        </span>
                      )}

                      {item.finish && (
                        <span>
                          Finish:{" "}
                          <strong className="text-[#d4cabb]">
                            {item.finish}
                          </strong>
                        </span>
                      )}

                      {item.customSize && (
                        <span className="text-[#0877b9]">
                          Custom Size
                        </span>
                      )}
                    </div>

                    {/* Custom measurements summary */}
                    {item.customSize &&
                      item.measurements &&
                      Object.keys(item.measurements).length > 0 && (
                        <div className="mt-4 border-l border-[#5a4b32] pl-4 text-xs leading-6 text-[#777064]">
                          Custom measurements entered
                        </div>
                      )}

                    {/* Bottom controls */}
                    <div className="mt-auto flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex w-fit items-center border border-[#cbd5e1]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.cartItemId,
                              item.quantity - 1
                            )
                          }
                          className="px-4 py-2 hover:bg-[#1d1914]"
                        >
                          âˆ’
                        </button>

                        <span className="min-w-12 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.cartItemId,
                              item.quantity + 1
                            )
                          }
                          className="px-4 py-2 hover:bg-[#1d1914]"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-5">
                        <span className="text-sm text-[#777064]">
                          ${item.price.toFixed(2)} each
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.cartItemId)
                          }
                          className="text-xs uppercase tracking-[0.15em] text-[#475569] hover:text-[#0877b9]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Summary */}
          <aside className="h-fit border border-[#cbd5e1] bg-[#ffffff] p-7">
            <p className="text-xs uppercase tracking-[0.3em] text-[#0369a1]">
              Order Summary
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold">
              YOUR ORDER
            </h2>

            <div className="my-7 h-px bg-[#332d24]" />

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-[#475569]">
                <span>Subtotal</span>

                <span className="text-[#17212b]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-[#475569]">
                <span>Shipping</span>

                <span className="text-[#17212b]">
                  Calculated at checkout
                </span>
              </div>

              <div className="flex justify-between text-[#475569]">
                <span>Tax</span>

                <span className="text-[#17212b]">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div className="my-7 h-px bg-[#332d24]" />

            <div className="flex items-center justify-between">
              <span className="font-serif text-xl font-bold">
                Subtotal
              </span>

              <span className="text-2xl font-bold text-[#0877b9]">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              className="mt-7 w-full bg-[#0877b9] px-6 py-5 text-sm font-bold uppercase tracking-[0.2em] text-[#ffffff] transition hover:bg-[#075985]"
              onClick={() =>
                alert("Checkout will be connected next.")
              }
            >
              Proceed to Checkout
            </button>

            <p className="mt-5 text-center text-xs leading-5 text-[#777064]">
              Secure checkout and payment options will be
              available in the next stage.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
