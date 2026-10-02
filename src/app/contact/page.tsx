"use client";

import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { useCallback, useEffect, useState } from "react";

type SupportMessage = {
  id: string;
  sender: "CUSTOMER" | "ADMIN";
  message: string;
  createdAt: string;
};

type SupportConversation = {
  id: string;
  status: "OPEN" | "CLOSED";
  blocked: boolean;
  blockedAt: string | null;
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
};

export default function ContactPage() {
  const [conversation, setConversation] =
    useState<SupportConversation | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loggedIn, setLoggedIn] =
    useState<boolean | null>(null);

  const loadConversation = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(
        "/api/support",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        setLoggedIn(false);
        setConversation(null);
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load support chat."
        );
      }

      setLoggedIn(true);
      setConversation(
        data.conversation ?? null
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load support chat."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const refreshConversation = async () => {
      if (!active) {
        return;
      }

      await loadConversation();
    };

    void refreshConversation();

    const interval = window.setInterval(() => {
      void refreshConversation();
    }, 5000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [loadConversation]);

  async function handleSend(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const trimmedMessage =
      message.trim();

    if (!trimmedMessage || sending) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch(
        "/api/support",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            message: trimmedMessage,
          }),
        }
      );

      const data =
        await response.json();

      if (response.status === 403) {
        setConversation(
          (current) =>
            current
              ? {
                  ...current,
                  blocked: true,
                  blockedAt:
                    current.blockedAt ??
                    new Date().toISOString(),
                }
              : current
        );

        throw new Error(
          data.error ||
            "Your support chat has been blocked."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to send your message."
        );
      }

      setMessage("");

      await loadConversation();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to send your message."
      );
    } finally {
      setSending(false);
    }
  }

  function formatMessageTime(
    value: string
  ) {
    return new Date(value).toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <StoreHeader />

      <section className="border-b border-[#e2e8f0] bg-[#ffffff] px-4 py-14 sm:px-6 sm:py-18">
        <div className="mx-auto max-w-5xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0369a1]">
            Customer Support
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
            Chat With Us
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#999184] sm:text-base">
            Have a question about an automation product,
            custom sizing, an order, shipping,
            or another requirement? Send us a
            message and our support team will
            assist you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 border border-[#e2e8f0] bg-white p-6 sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#0369a1]">
            Call or WhatsApp
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {["7456812005", "9759629484"].map((number) => (
              <div key={number} className="flex flex-wrap items-center justify-between gap-3 border border-[#e2e8f0] p-4">
                <a href={`tel:+91${number}`} className="font-semibold text-[#17212b] hover:text-[#0877b9]">
                  +91 {number}
                </a>
                <a
                  href={`https://wa.me/91${number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#0877b9] hover:text-[#075985]"
                >
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="border border-[#e2e8f0] bg-[#ffffff] p-10 text-center">
            <p className="text-sm text-[#999184]">
              Loading support chat...
            </p>
          </div>
        ) : loggedIn === false ? (
          <div className="border border-[#e2e8f0] bg-[#ffffff] p-8 text-center sm:p-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0369a1]">
              Customer Account Required
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold">
              Sign In to Chat With Us
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#999184]">
              Support chat is available to
              registered customers. Please sign
              in to send and receive messages
              from our support team.
            </p>

            <Link
              href="/account/login?redirect=/contact"
              className="mt-7 inline-flex bg-[#0877b9] px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#075985]"
            >
              Sign In to Continue
            </Link>

            <p className="mt-7 text-xs text-[#999184]">
              Don&apos;t have an account?{" "}
              <Link
                href="/account/register?redirect=/contact"
                className="text-[#0877b9] hover:text-[#075985]"
              >
                Create an account
              </Link>
            </p>
          </div>
        ) : (
          <div className="border border-[#e2e8f0] bg-[#ffffff]">
            <div className="border-b border-[#e2e8f0] px-5 py-5 sm:px-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#0369a1]">
                    Support Chat
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-bold">
                    Industrial Automation Support
                  </h2>
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0369a1]">
                  {conversation?.blocked
                    ? "Blocked"
                    : "Online Support"}
                </span>
              </div>
            </div>

            <div className="min-h-[420px] max-h-[600px] space-y-4 overflow-y-auto px-4 py-6 sm:px-7">
              {!conversation ||
              conversation.messages.length === 0 ? (
                <div className="flex min-h-[350px] items-center justify-center text-center">
                  <div>
                    <p className="font-serif text-xl font-bold">
                      How can we help?
                    </p>

                    <p className="mt-3 max-w-md text-sm leading-6 text-[#999184]">
                      Ask us about products,
                      custom measurements,
                      product specifications,
                      orders, shipping, or any
                      other requirement.
                    </p>
                  </div>
                </div>
              ) : (
                conversation.messages.map(
                  (item) => {
                    const customer =
                      item.sender ===
                      "CUSTOMER";

                    return (
                      <div
                        key={item.id}
                        className={
                          customer
                            ? "flex justify-end"
                            : "flex justify-start"
                        }
                      >
                        <div
                          className={
                            customer
                              ? "max-w-[85%] bg-[#0877b9] px-4 py-3 text-white sm:max-w-[70%]"
                              : "max-w-[85%] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-[#17212b] sm:max-w-[70%]"
                          }
                        >
                          <p className="whitespace-pre-wrap text-sm leading-6">
                            {item.message}
                          </p>

                          <p
                            className={
                              customer
                                ? "mt-2 text-[9px] uppercase tracking-[0.12em] text-white/70"
                                : "mt-2 text-[9px] uppercase tracking-[0.12em] text-[#999184]"
                            }
                          >
                            {customer
                              ? "You"
                              : "Support Team"}{" "}
                            ·{" "}
                            {formatMessageTime(
                              item.createdAt
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>

            {error && (
              <div className="mx-4 mb-4 border border-[#d4aaa0] bg-[#f8ebe7] px-4 py-3 text-sm text-[#8d4b40] sm:mx-7">
                {error}
              </div>
            )}

            {conversation?.blocked ? (
              <div className="border-t border-[#e2e8f0] bg-[#f8ebe7] px-5 py-5 sm:px-7">
                <p className="text-sm font-semibold text-[#8d4b40]">
                  Support chat blocked
                </p>

                <p className="mt-2 text-sm leading-6 text-[#8d4b40]">
                  Further messages cannot be
                  sent through chat. If you need
                  assistance, please contact us by
                  email.
                </p>

                <a
                  href="/request-quote"
                  className="mt-4 inline-flex text-[10px] font-bold uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#075985]"
                >
                  Email Support
                </a>
              </div>
            ) : (
              <form
                onSubmit={handleSend}
                className="border-t border-[#e2e8f0] p-4 sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <textarea
                    value={message}
                    onChange={(event) =>
                      setMessage(
                        event.target.value
                      )
                    }
                    maxLength={2000}
                    rows={3}
                    placeholder="Write your message..."
                    disabled={sending}
                    className="min-h-[90px] flex-1 resize-none border border-[#cbd5e1] bg-[#ffffff] px-4 py-3 text-sm text-[#17212b] outline-none placeholder:text-[#aaa399] focus:border-[#0877b9] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="submit"
                    disabled={
                      sending ||
                      !message.trim()
                    }
                    className="self-end bg-[#0877b9] px-7 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#075985] disabled:cursor-not-allowed disabled:opacity-50 sm:self-end"
                  >
                    {sending
                      ? "Sending..."
                      : "Send Message"}
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-[#999184]">
                  <span>
                    Our team will respond here.
                  </span>

                  <span>
                    {message.length}/2000
                  </span>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="mt-8 border border-[#e2e8f0] bg-[#ffffff] p-6 text-center sm:p-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#0369a1]">
            Prefer Email?
          </p>

          <p className="mt-3 text-sm leading-6 text-[#999184]">
            You can also contact our support team
            directly by email.
          </p>

          <a
            href="/request-quote"
            className="mt-4 inline-block text-sm text-[#0877b9] hover:text-[#075985]"
          >
            Submit a quote request
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
