"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartButton() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Shopping cart, ${totalItems} items`}
      className="group relative inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-600 hover:text-sky-700"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-5 w-5 text-sky-700 transition-transform duration-200 group-hover:scale-110"
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

      <span>Cart</span>

      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-700 px-1.5 text-[10px] font-bold text-white">
        {totalItems}
      </span>
    </Link>
  );
}

