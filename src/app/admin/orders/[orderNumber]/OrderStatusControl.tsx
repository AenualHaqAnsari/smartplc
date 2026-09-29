"use client";

import { useState } from "react";

const orderStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "CUSTOMIZATION",
  "READY_TO_SHIP",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

const paymentStatuses = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
] as const;

type OrderStatus =
  (typeof orderStatuses)[number];

type PaymentStatus =
  (typeof paymentStatuses)[number];

export default function OrderStatusControl({
  orderNumber,
  initialStatus,
  initialPaymentStatus,
}: {
  orderNumber: string;
  initialStatus: string;
  initialPaymentStatus: string;
}) {
  const [status, setStatus] =
    useState<OrderStatus>(
      orderStatuses.includes(
        initialStatus as OrderStatus
      )
        ? (initialStatus as OrderStatus)
        : "PENDING"
    );

  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>(
      paymentStatuses.includes(
        initialPaymentStatus as PaymentStatus
      )
        ? (initialPaymentStatus as PaymentStatus)
        : "PENDING"
    );

  const [savingOrder, setSavingOrder] =
    useState(false);

  const [savingPayment, setSavingPayment] =
    useState(false);

  const [orderMessage, setOrderMessage] =
    useState("");

  const [paymentMessage, setPaymentMessage] =
    useState("");

  async function updateOrderStatus(
    newStatus: OrderStatus
  ) {
    const previousStatus = status;

    setStatus(newStatus);
    setSavingOrder(true);
    setOrderMessage("");

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(
          orderNumber
        )}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update order status."
        );
      }

      setOrderMessage(
        "Order status updated successfully."
      );
    } catch (error) {
      console.error(error);

      setStatus(previousStatus);

      setOrderMessage(
        error instanceof Error
          ? error.message
          : "Unable to update order status."
      );
    } finally {
      setSavingOrder(false);
    }
  }

  async function updatePaymentStatus(
    newStatus: PaymentStatus
  ) {
    const previousStatus = paymentStatus;

    setPaymentStatus(newStatus);
    setSavingPayment(true);
    setPaymentMessage("");

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(
          orderNumber
        )}/payment-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentStatus: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update payment status."
        );
      }

      setPaymentMessage(
        "Payment status updated successfully."
      );
    } catch (error) {
      console.error(error);

      setPaymentStatus(previousStatus);

      setPaymentMessage(
        error instanceof Error
          ? error.message
          : "Unable to update payment status."
      );
    } finally {
      setSavingPayment(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      {/* Order Status */}
      <div className="border border-[#e2e8f0] bg-[#ffffff] p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
          Order Management
        </p>

        <h2 className="mt-3 font-serif text-2xl font-bold">
          ORDER STATUS
        </h2>

        <select
          value={status}
          disabled={savingOrder}
          onChange={(event) =>
            updateOrderStatus(
              event.target.value as OrderStatus
            )
          }
          className="mt-5 w-full border border-[#4a4031] bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#0877b9] outline-none focus:border-[#0284c7] disabled:opacity-50"
        >
          {orderStatuses.map((item) => (
            <option
              key={item}
              value={item}
              className="bg-[#f8fafc] text-[#17212b]"
            >
              {item.replaceAll("_", " ")}
            </option>
          ))}
        </select>

        {savingOrder && (
          <p className="mt-3 text-xs text-[#475569]">
            Saving...
          </p>
        )}

        {!savingOrder && orderMessage && (
          <p className="mt-3 text-xs text-[#0877b9]">
            {orderMessage}
          </p>
        )}
      </div>

      {/* Payment Status */}
      <div className="border border-[#e2e8f0] bg-[#ffffff] p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
          Payment
        </p>

        <h2 className="mt-3 font-serif text-2xl font-bold">
          PAYMENT STATUS
        </h2>

        <select
          value={paymentStatus}
          disabled={savingPayment}
          onChange={(event) =>
            updatePaymentStatus(
              event.target
                .value as PaymentStatus
            )
          }
          className="mt-5 w-full border border-[#4a4031] bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#0877b9] outline-none focus:border-[#0284c7] disabled:opacity-50"
        >
          {paymentStatuses.map((item) => (
            <option
              key={item}
              value={item}
              className="bg-[#f8fafc] text-[#17212b]"
            >
              {item.replaceAll("_", " ")}
            </option>
          ))}
        </select>

        {savingPayment && (
          <p className="mt-3 text-xs text-[#475569]">
            Saving...
          </p>
        )}

        {!savingPayment && paymentMessage && (
          <p className="mt-3 text-xs text-[#0877b9]">
            {paymentMessage}
          </p>
        )}
      </div>
    </div>
  );
}