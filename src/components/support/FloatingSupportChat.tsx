"use client";

import Link from "next/link";
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

export default function FloatingSupportChat() {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] =
    useState<SupportConversation | null>(null);

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  const loadConversation = useCallback(async () => {
    try {
      const response = await fetch("/api/support", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (response.status === 401) {
        setLoggedIn(false);
        setConversation(null);
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load support chat."
        );
      }

      setLoggedIn(true);
      setConversation(data.conversation ?? null);
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
    if (!open) {
      return;
    }

    const initialLoad = window.setTimeout(() => { void loadConversation(); }, 0);
    const interval = window.setInterval(() => {
      void loadConversation();
    }, 5000);

    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [open, loadConversation]);

  async function handleSend(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || sending) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setLoggedIn(false);
        throw new Error(
          data.error || "Please sign in to use support chat."
        );
      }

      if (response.status === 403) {
        setConversation((current) =>
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

  function formatMessageTime(value: string) {
    return new Date(value).toLocaleTimeString(
      undefined,
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  const messageCount =
    conversation?.messages.length ?? 0;

  const lastMessage =
    conversation?.messages[
      conversation.messages.length - 1
    ];

  const showUnread =
    !open &&
    lastMessage?.sender === "ADMIN";

  return (
    <div className="fixed bottom-5 right-5 z-[9999] sm:bottom-6 sm:right-6">
      {open ? (
        <div className="flex h-[min(680px,calc(100vh-40px))] w-[calc(100vw-32px)] max-w-[390px] flex-col overflow-hidden border border-[#d8cdbb] bg-[#ffffff] shadow-[0_20px_60px_rgba(36,35,33,0.22)]">
          <div className="flex shrink-0 items-center justify-between border-b border-[#d8cdbb] bg-[#17212b] px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0877b9] text-sm">
                💬
              </div>

              <div>
                <p className="font-serif text-base font-bold">
                  Industrial Automation
                </p>

                <p className="text-[9px] uppercase tracking-[0.18em] text-white/60">
                  Customer Support
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Minimize support chat"
                className="flex h-9 w-9 items-center justify-center text-lg text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                −
              </button>

              <Link
                href="/contact"
                aria-label="Open full support page"
                className="flex h-9 w-9 items-center justify-center text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                ↗
              </Link>
            </div>
          </div>

          {!loggedIn && !loading ? (
            <div className="flex flex-1 flex-col items-center justify-center px-7 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f1eadf] text-2xl">
                💬
              </div>

              <h3 className="mt-5 font-serif text-2xl font-bold text-[#17212b]">
                Chat With Us
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#999184]">
                Sign in to chat directly with our
                support team about products, orders,
                sizing, shipping and more.
              </p>

              <Link
                href="/account/login?redirect=/"
                onClick={() => setOpen(false)}
                className="mt-6 bg-[#0877b9] px-7 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#075985]"
              >
                Sign In to Chat
              </Link>

              <p className="mt-4 text-xs text-[#999184]">
                New customer?{" "}
                <Link
                  href="/account/register?redirect=/"
                  onClick={() => setOpen(false)}
                  className="text-[#0877b9]"
                >
                  Create an account
                </Link>
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto bg-[#f8fafc] px-3 py-4">
                {loading && !conversation ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-xs text-[#999184]">
                      Loading support...
                    </p>
                  </div>
                ) : !conversation ||
                  conversation.messages.length === 0 ? (
                  <div className="flex h-full min-h-[300px] items-center justify-center px-6 text-center">
                    <div>
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ffffff] text-xl shadow-sm">
                        💬
                      </div>

                      <h3 className="mt-4 font-serif text-xl font-bold text-[#17212b]">
                        How can we help?
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-[#999184]">
                        Ask us about products, application details,
                        orders, delivery or anything
                        else you need help with.
                      </p>
                    </div>
                  </div>
                ) : (
                  conversation.messages.map((item) => {
                    const customer =
                      item.sender === "CUSTOMER";

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
                              ? "max-w-[82%] rounded-2xl rounded-br-sm bg-[#0877b9] px-3.5 py-2.5 text-white"
                              : "max-w-[82%] rounded-2xl rounded-bl-sm border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-[#17212b]"
                          }
                        >
                          <p className="whitespace-pre-wrap text-[13px] leading-5">
                            {item.message}
                          </p>

                          <p
                            className={
                              customer
                                ? "mt-1 text-[9px] text-white/60"
                                : "mt-1 text-[9px] text-[#aaa399]"
                            }
                          >
                            {formatMessageTime(
                              item.createdAt
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {error && (
                <div className="shrink-0 border-t border-[#e2e8f0] bg-[#f8ebe7] px-3 py-2 text-xs text-[#8d4b40]">
                  {error}
                </div>
              )}

              {conversation?.blocked ? (
                <div className="shrink-0 border-t border-[#e2e8f0] bg-[#f8ebe7] px-4 py-4">
                  <p className="text-xs font-semibold text-[#8d4b40]">
                    Support chat blocked
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8d4b40]">
                    Please contact us by email if
                    you need further assistance.
                  </p>

                  <a
                    href="/request-quote"
                    className="mt-2 inline-block text-[9px] font-bold uppercase tracking-[0.12em] text-[#0877b9]"
                  >
                    Email Support
                  </a>
                </div>
              ) : (
                <form
                  onSubmit={handleSend}
                  className="shrink-0 border-t border-[#e2e8f0] bg-[#ffffff] p-3"
                >
                  <div className="flex items-end gap-2">
                    <textarea
                      value={message}
                      onChange={(event) =>
                        setMessage(event.target.value)
                      }
                      maxLength={2000}
                      rows={1}
                      disabled={sending}
                      placeholder="Write a message..."
                      className="max-h-28 min-h-[42px] flex-1 resize-none rounded-2xl border border-[#cbd5e1] bg-white px-4 py-2.5 text-sm text-[#17212b] outline-none placeholder:text-[#aaa399] focus:border-[#0877b9]"
                    />

                    <button
                      type="submit"
                      disabled={
                        sending ||
                        !message.trim()
                      }
                      aria-label="Send message"
                      className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#0877b9] text-white transition hover:bg-[#075985] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ➤
                    </button>
                  </div>

                  <div className="mt-1 flex justify-end text-[9px] text-[#aaa399]">
                    {message.length}/2000
                  </div>
                </form>
              )}
            </>
          )}

          {messageCount > 0 && (
            <div className="pointer-events-none absolute bottom-[78px] left-1/2 -translate-x-1/2 rounded-full bg-[#17212b]/80 px-2 py-1 text-[8px] text-white opacity-0">
              {messageCount}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open customer support chat"
          className="group relative flex items-center gap-3 rounded-full bg-[#17212b] px-5 py-3.5 text-white shadow-[0_10px_35px_rgba(36,35,33,0.25)] transition hover:-translate-y-0.5 hover:bg-[#302e2a]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0877b9] text-base">
            💬
          </span>

          <span className="text-left">
            <span className="block text-[10px] font-bold uppercase tracking-[0.16em]">
              Customer Support
            </span>

            <span className="mt-0.5 block text-[9px] text-white/55">
              Chat with us
            </span>
          </span>

          {showUnread && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#b54b3e] px-1 text-[9px] font-bold text-white">
              1
            </span>
          )}
        </button>
      )}
    </div>
  );
}
