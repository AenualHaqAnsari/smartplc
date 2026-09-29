"use client";

import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/account/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to sign in."
        );
      }

      /*
       * Return the customer to the page
       * they originally wanted to access.
       *
       * Example:
       *
       * /account/login?redirect=/cart
       *
       * After login:
       *
       * /cart
       */
      const params =
        new URLSearchParams(
          window.location.search
        );

      const requestedRedirect =
        params.get("redirect");

      /*
       * Only allow internal redirects.
       * This prevents an external URL from
       * being supplied as the redirect.
       */
      const destination =
        requestedRedirect &&
        requestedRedirect.startsWith("/") &&
        !requestedRedirect.startsWith("//")
          ? requestedRedirect
          : "/account";

      /*
       * Full page navigation ensures the
       * newly-created customer cookie is
       * available everywhere and the
       * CartProvider starts again with the
       * authenticated customer.
       */
      window.location.href =
        destination;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in."
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <StoreHeader />

      <section className="mx-auto max-w-lg px-6 py-20">
        <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
          Customer Account
        </p>

        <h1 className="mt-3 font-serif text-5xl font-bold">
          SIGN IN
        </h1>

        <p className="mt-5 text-[#475569]">
          Sign in to view your orders and
          manage your account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-5 border border-[#cbd5e1] bg-[#ffffff] p-7"
        >
          <label className="block">
            <span className="text-xs uppercase tracking-[0.15em] text-[#475569]">
              Email
            </span>

            <input
              type="email"
              required
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              className="mt-2 min-h-12 w-full border border-[#cbd5e1] bg-[#ffffff] px-4 text-[#17212b] outline-none focus:border-[#0284c7]"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.15em] text-[#475569]">
              Password
            </span>

            <input
              type="password"
              required
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              className="mt-2 min-h-12 w-full border border-[#cbd5e1] bg-[#ffffff] px-4 text-[#17212b] outline-none focus:border-[#0284c7]"
            />
          </label>

          {error && (
            <div className="border border-[#d4aaa0] bg-[#f8ebe7] p-4 text-sm text-[#d79b8d]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0877b9] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#ffffff] transition hover:bg-[#075985] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>

          <p className="text-center text-sm text-[#475569]">
            Don&apos;t have an account?{" "}
            <Link
              href="/account/register"
              className="text-[#0877b9] hover:text-[#075985]"
            >
              Create Account
            </Link>
          </p>
        </form>
      </section>
          <SiteFooter />
    </main>
  );
}
