"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SupportMessage = {
  id: string;
  sender: "CUSTOMER" | "ADMIN";
  message: string;
  createdAt: string;
};

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string;
};

type SupportConversation = {
  id: string;
  customerId: string;
  status: "OPEN" | "CLOSED";
  blocked: boolean;
  blockedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  messages: SupportMessage[];
};

export default function AdminSupportPage() {
  const router = useRouter();
  const [conversations, setConversations] =
    useState<SupportConversation[]>([]);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [reply, setReply] =
    useState("");

  const [sendingReply, setSendingReply] =
    useState(false);

  const [replyError, setReplyError] =
    useState("");

  const [updatingBlock, setUpdatingBlock] =
    useState(false);

  const [blockError, setBlockError] =
    useState("");

  async function loadConversations() {
    try {
      setError("");

      const response = await fetch(
        "/api/admin/support",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load support conversations."
        );
      }

      const items =
        Array.isArray(data.conversations)
          ? data.conversations
          : [];

      setConversations(items);

      setSelectedId((current) => {
        if (
          current &&
          items.some(
            (conversation: SupportConversation) =>
              conversation.id === current
          )
        ) {
          return current;
        }

        return items.length > 0
          ? items[0].id
          : null;
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load support conversations."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    const refreshConversations = async () => {
      if (!active) {
        return;
      }

      await loadConversations();
    };

    void refreshConversations();

    const interval = window.setInterval(() => {
      void refreshConversations();
    }, 5000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  async function sendReply() {
    if (!selectedConversation) {
      return;
    }

    const trimmedReply = reply.trim();

    if (!trimmedReply) {
      setReplyError("Please enter a reply.");
      return;
    }

    if (trimmedReply.length > 2000) {
      setReplyError(
        "Reply cannot exceed 2000 characters."
      );
      return;
    }

    if (selectedConversation.blocked) {
      setReplyError(
        "This customer is blocked from support chat."
      );
      return;
    }

    try {
      setSendingReply(true);
      setReplyError("");

      const response = await fetch(
        `/api/admin/support/${selectedConversation.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: trimmedReply,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to send reply."
        );
      }

      if (!data.message) {
        throw new Error(
          "Reply was sent but no message was returned."
        );
      }

      setConversations((current) =>
        current.map((conversation) => {
          if (
            conversation.id !==
            selectedConversation.id
          ) {
            return conversation;
          }

          return {
            ...conversation,
            status:
              data.conversation?.status ??
              conversation.status,
            blocked:
              data.conversation?.blocked ??
              conversation.blocked,
            blockedAt:
              data.conversation?.blockedAt ??
              conversation.blockedAt,
            updatedAt:
              data.conversation?.updatedAt ??
              new Date().toISOString(),
            messages: [
              ...conversation.messages,
              data.message,
            ],
          };
        })
      );

      setReply("");
      setReplyError("");
    } catch (error) {
      setReplyError(
        error instanceof Error
          ? error.message
          : "Unable to send reply."
      );
    } finally {
      setSendingReply(false);
    }
  }

  async function updateBlockStatus(blocked: boolean) {
    if (!selectedConversation) {
      return;
    }

    const action = blocked
      ? "block"
      : "unblock";

    const confirmed = window.confirm(
      blocked
        ? "Are you sure you want to block this customer from support chat?"
        : "Are you sure you want to unblock this customer and allow support messages again?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingBlock(true);
      setBlockError("");

      const response = await fetch(
        "/api/admin/support",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId:
              selectedConversation.id,
            blocked,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Unable to ${action} customer.`
        );
      }

      if (!data.conversation) {
        throw new Error(
          "The server did not return the updated conversation."
        );
      }

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id ===
          selectedConversation.id
            ? {
                ...conversation,
                status:
                  data.conversation.status,
                blocked:
                  data.conversation.blocked,
                blockedAt:
                  data.conversation.blockedAt,
                updatedAt:
                  data.conversation.updatedAt,
              }
            : conversation
        )
      );

      setReplyError("");
      setBlockError("");
      setReply("");
    } catch (error) {
      setBlockError(
        error instanceof Error
          ? error.message
          : `Unable to ${action} customer.`
      );
    } finally {
      setUpdatingBlock(false);
    }
  }

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) ?? null;

  function formatDate(value: string) {
    return new Date(value).toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  function getLatestMessage(
    conversation: SupportConversation
  ) {
    if (conversation.messages.length === 0) {
      return "No messages yet";
    }

    return conversation.messages[
      conversation.messages.length - 1
    ].message;
  }

  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-[#f8fafc] text-[#3f3a34]">
      {/* Header */}
      <header className="shrink-0 border-b border-[#e2e8f0]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#0369a1]">
              Store Administration
            </p>

            <h1 className="mt-1 font-serif text-2xl font-bold tracking-[0.08em]">
              INDUSTRIAL AUTOMATION
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#9a7638]"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/products"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#9a7638]"
            >
              Products
            </Link>

            <Link
              href="/admin/reviews"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#9a7638]"
            >
              Reviews
            </Link>

            <Link
              href="/admin/settings"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#9a7638]"
            >
              Settings
            </Link>

            <Link
              href="/"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#9a7638]"
            >
              View Store →
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-0 flex-1 w-full max-w-7xl flex-col overflow-hidden px-6 py-4">
        {/* Compact Support Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#e2e8f0] pb-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#0369a1]">
              Customer Support
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#999184]">
              Conversations
            </span>

            <span className="ml-2 font-serif text-lg font-bold text-[#3f3a34]">
              {conversations.length}
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-2 border border-[#d4aaa0] bg-[#f8ebe7] px-5 py-4 text-sm text-[#8d4b40]">
            {error}
          </div>
        )}

        {/* Professional Support Inbox */}
        <div className="mt-0 min-h-0 flex flex-1 flex-col overflow-hidden rounded-none border border-[#e2e8f0] bg-[#ffffff] shadow-sm">


          {/* Helpdesk */}
          <div className="min-h-0 flex-1 overflow-hidden lg:grid lg:grid-cols-[320px_minmax(0,1fr)]">

            {/* ==================================================
                 CONVERSATION LIST
            ================================================== */}
            <aside className="flex min-h-0 flex-col border-b border-[#e2e8f0] bg-[#faf7f0] lg:border-b-0 lg:border-r">

              <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-transparent px-5 py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#625c53]">
                    Inbox
                  </p>

                  <p className="mt-1 text-[9px] text-[#aaa194]">
                    {conversations.length} conversation
                    {conversations.length === 1 ? "" : "s"}
                  </p>
                </div>

                <span className="rounded-full bg-[#ffffff] px-2.5 py-1 text-[9px] font-bold text-[#0369a1]">
                  {
                    conversations.filter(
                      (conversation) =>
                        conversation.status === "OPEN"
                    ).length
                  }{" "}
                  OPEN
                </span>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">

                {loading ? (
                  <div className="p-6 text-sm text-[#999184]">
                    Loading conversations...
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-6">
                    <p className="text-sm font-semibold text-[#625c53]">
                      No conversations
                    </p>

                    <p className="mt-2 text-xs leading-5 text-[#999184]">
                      Customer support conversations will appear here.
                    </p>
                  </div>
                ) : (
                  conversations.map((conversation) => {
                    const selected =
                      conversation.id === selectedId;

                    const latestMessage =
                      conversation.messages[
                        conversation.messages.length - 1
                      ];

                    return (
                      <button
                        key={conversation.id}
                        type="button"
                        onClick={() =>
                          setSelectedId(conversation.id)
                        }
                        className={`block w-full border-b border-[#e4ddd1] px-5 py-4 text-left transition ${
                          selected
                            ? "bg-[#ffffff] shadow-[inset_3px_0_0_#0877b9]"
                            : "hover:bg-[#f3eee5]"
                        }`}
                      >

                        <div className="flex items-start gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e1d8ca] font-serif text-sm font-bold text-[#625c53]">
                            {conversation.customer.firstName
                              ?.charAt(0)
                              .toUpperCase() || "C"}
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-2">

                              <p className="truncate text-sm font-semibold text-[#3f3a34]">
                                {conversation.customer.firstName}{" "}
                                {conversation.customer.lastName}
                              </p>

                              {conversation.blocked && (
                                <span className="shrink-0 rounded-full bg-[#f8ebe7] px-2 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-[#8d4b40]">
                                  Blocked
                                </span>
                              )}

                            </div>

                            <p className="mt-1 truncate text-[9px] text-[#999184]">
                              {conversation.customer.email}
                            </p>

                            {latestMessage && (
                              <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[#475569]">
                                {latestMessage.message}
                              </p>
                            )}

                            <div className="mt-3 flex items-center justify-between">

                              <span
                                className={`text-[8px] font-bold uppercase tracking-[0.14em] ${
                                  conversation.status === "OPEN"
                                    ? "text-[#0369a1]"
                                    : "text-[#aaa194]"
                                }`}
                              >
                                {conversation.status}
                              </span>

                              <span className="text-[8px] text-[#aaa194]">
                                {formatDate(
                                  conversation.updatedAt
                                )}
                              </span>

                            </div>

                          </div>

                        </div>

                      </button>
                    );
                  })
                )}

              </div>
            </aside>

            {/* ==================================================
                 CHAT PANEL
            ================================================== */}
            <section className="min-h-0 min-w-0 overflow-hidden bg-[#ffffff] lg:flex lg:flex-col">

              {!selectedConversation ? (

                <div className="flex flex-1 items-center justify-center px-8 py-16 text-center">

                  <div className="max-w-sm">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#e2e8f0] bg-[#f3eee5] text-2xl">
                      💬
                    </div>

                    <p className="mt-5 font-serif text-2xl font-bold text-[#3f3a34]">
                      Select a conversation
                    </p>

                    <p className="mt-3 text-sm leading-6 text-[#999184]">
                      Select a customer from the inbox to view the
                      complete conversation and reply.
                    </p>

                  </div>

                </div>

              ) : (

                <>

                  {/* ==================================================
                       CUSTOMER HEADER
                  ================================================== */}
                  <div className="shrink-0 border-b border-[#e2e8f0] bg-[#ffffff] px-5 py-4 sm:px-7">

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                      <div className="flex min-w-0 items-center gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0877b9] font-serif text-lg font-bold text-white">
                          {selectedConversation.customer.firstName
                            ?.charAt(0)
                            .toUpperCase() || "C"}
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-serif text-xl font-bold text-[#3f3a34]">
                              {selectedConversation.customer.firstName}{" "}
                              {selectedConversation.customer.lastName}
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] ${
                                selectedConversation.status === "OPEN"
                                  ? "bg-[#f7f1e4] text-[#0369a1]"
                                  : "bg-[#f1ece2] text-[#999184]"
                              }`}
                            >
                              {selectedConversation.status}
                            </span>

                            {selectedConversation.blocked && (
                              <span className="rounded-full bg-[#f8ebe7] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#8d4b40]">
                                BLOCKED
                              </span>
                            )}

                          </div>

                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#999184]">

                            <span>
                              {selectedConversation.customer.email}
                            </span>

                            {selectedConversation.customer.phone && (
                              <span>
                                {selectedConversation.customer.phone}
                              </span>
                            )}

                            <span>
                              {selectedConversation.customer.country}
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* Block controls */}
                      <div className="flex shrink-0 items-center gap-2">

                        {selectedConversation.blocked ? (
                          <>
                            <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#8d4b40]">
                              Chat blocked
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                void updateBlockStatus(false);
                              }}
                              disabled={updatingBlock}
                              className="rounded border border-[#0877b9] bg-[#ffffff] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.14em] text-[#9a7638] transition hover:bg-transparent disabled:opacity-50"
                            >
                              {updatingBlock
                                ? "Updating..."
                                : "Unblock"}
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              void updateBlockStatus(true);
                            }}
                            disabled={updatingBlock}
                            className="rounded border border-[#c99b91] bg-[#ffffff] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.14em] text-[#8d4b40] transition hover:bg-[#f8ebe7] disabled:opacity-50"
                          >
                            {updatingBlock
                              ? "Updating..."
                              : "Block Customer"}
                          </button>
                        )}

                      </div>

                    </div>

                    {blockError && (
                      <p className="mt-3 rounded border border-[#d4aaa0] bg-[#f8ebe7] px-3 py-2 text-xs text-[#8d4b40]">
                        {blockError}
                      </p>
                    )}

                  </div>

                  {/* ==================================================
                       MESSAGE AREA
                  ================================================== */}
                  <div className="min-h-0 flex-1 overflow-y-auto bg-[#f5f1e9] px-4 py-4 sm:px-8">

                    {selectedConversation.messages.length === 0 ? (

                      <div className="flex h-full min-h-[350px] items-center justify-center text-center">

                        <div>

                          <p className="text-sm font-semibold text-[#625c53]">
                            No messages yet
                          </p>

                          <p className="mt-2 text-xs text-[#999184]">
                            Send a reply to start the conversation.
                          </p>

                        </div>

                      </div>

                    ) : (

                      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">

                        {selectedConversation.messages.map(
                          (item) => {

                            const customer =
                              item.sender === "CUSTOMER";

                            return (
                              <div
                                key={item.id}
                                className={`flex ${
                                  customer
                                    ? "justify-start"
                                    : "justify-end"
                                }`}
                              >

                                <div
                                  className={`flex max-w-[88%] items-end gap-2 sm:max-w-[75%] ${
                                    customer
                                      ? "flex-row"
                                      : "flex-row-reverse"
                                  }`}
                                >

                                  {/* Avatar */}
                                  <div
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                                      customer
                                        ? "bg-[#e2e8f0] text-[#625c53]"
                                        : "bg-[#0877b9] text-white"
                                    }`}
                                  >
                                    {customer ? "C" : "A"}
                                  </div>

                                  {/* Message */}
                                  <div
                                    className={`min-w-0 rounded-2xl px-4 py-3 shadow-sm ${
                                      customer
                                        ? "rounded-bl-sm border border-[#e2e8f0] bg-[#ffffff]"
                                        : "rounded-br-sm bg-[#0877b9] text-white"
                                    }`}
                                  >

                                    <div className="flex items-center gap-3">

                                      <span
                                        className={`text-[8px] font-bold uppercase tracking-[0.16em] ${
                                          customer
                                            ? "text-[#0369a1]"
                                            : "text-white/75"
                                        }`}
                                      >
                                        {customer
                                          ? "Customer"
                                          : "Admin"}
                                      </span>

                                      <span
                                        className={`text-[8px] ${
                                          customer
                                            ? "text-[#aaa194]"
                                            : "text-white/60"
                                        }`}
                                      >
                                        {formatDate(
                                          item.createdAt
                                        )}
                                      </span>

                                    </div>

                                    <p
                                      className={`mt-2 whitespace-pre-wrap break-words text-sm leading-6 ${
                                        customer
                                          ? "text-[#3f3a34]"
                                          : "text-white"
                                      }`}
                                    >
                                      {item.message}
                                    </p>

                                  </div>

                                </div>

                              </div>
                            );
                          }
                        )}

                      </div>

                    )}

                  </div>

                  {/* ==================================================
                       REPLY COMPOSER
                  ================================================== */}
                  <div className="shrink-0 border-t border-[#e2e8f0] bg-[#ffffff] px-4 py-2.5 sm:px-5">

                    {replyError && (
                      <div className="mb-3 rounded border border-[#d4aaa0] bg-[#f8ebe7] px-4 py-2.5 text-xs text-[#8d4b40]">
                        {replyError}
                      </div>
                    )}

                    {selectedConversation.blocked ? (

                      <div className="flex items-center justify-between gap-4 rounded border border-[#d4aaa0] bg-[#f8ebe7] px-4 py-3">

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8d4b40]">
                            Support chat blocked
                          </p>

                          <p className="mt-1 text-xs text-[#8d4b40]">
                            Unblock this customer to send a reply.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            void updateBlockStatus(false);
                          }}
                          disabled={updatingBlock}
                          className="shrink-0 rounded bg-[#0877b9] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#075985] disabled:opacity-50"
                        >
                          {updatingBlock
                            ? "Updating..."
                            : "Unblock"}
                        </button>

                      </div>

                    ) : (

                      <div className="flex items-end gap-3">

                        <div className="min-w-0 flex-1">

                          <div className="mb-2 flex items-center justify-between">

                            <label
                              htmlFor="admin-support-reply"
                              className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#475569]"
                            >
                              Reply to customer
                            </label>

                            <span className="text-[9px] text-[#aaa194]">
                              {reply.length}/2000
                            </span>

                          </div>

                          <textarea
                            id="admin-support-reply"
                            value={reply}
                            onChange={(event) => {
                              setReply(event.target.value);

                              if (replyError) {
                                setReplyError("");
                              }
                            }}
                            onKeyDown={(event) => {
                              if (
                                event.key === "Enter" &&
                                (event.ctrlKey ||
                                  event.metaKey)
                              ) {
                                event.preventDefault();
                                void sendReply();
                              }
                            }}
                            disabled={sendingReply}
                            maxLength={2000}
                            rows={2}
                            placeholder="Write your reply..."
                            className="w-full resize-none rounded border border-[#cbd5e1] bg-[#faf7f0] px-3 py-2 text-sm leading-5 text-[#3f3a34] outline-none transition placeholder:text-[#aaa194] focus:border-[#0877b9] disabled:cursor-not-allowed disabled:opacity-60"
                          />

                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            void sendReply();
                          }}
                          disabled={
                            sendingReply ||
                            !reply.trim()
                          }
                          className="shrink-0 rounded bg-[#0877b9] px-6 py-3 text-[9px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#075985] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {sendingReply
                            ? "Sending..."
                            : "Send Reply"}
                        </button>

                      </div>

                    )}

                    {!selectedConversation.blocked && (
                      <p className="mt-2 text-[8px] text-[#aaa194]">
                        Ctrl + Enter / Cmd + Enter to send
                      </p>
                    )}

                  </div>

                </>

              )}

            </section>

          </div>

        </div>
      </section>
    </main>
  );
}
