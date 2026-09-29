"use client";

import { useEffect, useState } from "react";

const STATUSES = [
  "NOT_SHIPPED",
  "LABEL_CREATED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "EXCEPTION",
  "RETURNED",
] as const;

type ShipmentEvent = {
  id: string;
  status: string;
  description: string;
  location: string | null;
  eventTime: string;
};

type Shipment = {
  id: string;
  courier: string;
  trackingNumber: string | null;
  status: string;
  shippedAt: string | null;
  estimatedDelivery: string | null;
  deliveredAt: string | null;
  currentLocation: string | null;
  lastUpdated: string | null;
  notes: string | null;
  events: ShipmentEvent[];
};

type Props = {
  orderNumber: string;
};

function toDateInput(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

export default function ShipmentControl({
  orderNumber,
}: Props) {
  const [shipment, setShipment] =
    useState<Shipment | null>(null);

  const [courier, setCourier] =
    useState("");

  const [trackingNumber, setTrackingNumber] =
    useState("");

  const [status, setStatus] =
    useState<(typeof STATUSES)[number]>(
      "NOT_SHIPPED"
    );

  const [currentLocation, setCurrentLocation] =
    useState("");

  const [shippedAt, setShippedAt] =
    useState("");

  const [estimatedDelivery, setEstimatedDelivery] =
    useState("");

  const [deliveredAt, setDeliveredAt] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [eventDescription, setEventDescription] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    async function loadShipment() {
      try {
        const response = await fetch(
          `/api/admin/orders/${encodeURIComponent(
            orderNumber
          )}/shipment`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load shipment."
          );
        }

        if (data.shipment) {
          const value = data.shipment as Shipment;

          setShipment(value);
          setCourier(value.courier ?? "");
          setTrackingNumber(
            value.trackingNumber ?? ""
          );
          setStatus(
            value.status as (typeof STATUSES)[number]
          );
          setCurrentLocation(
            value.currentLocation ?? ""
          );
          setShippedAt(
            toDateInput(value.shippedAt)
          );
          setEstimatedDelivery(
            toDateInput(
              value.estimatedDelivery
            )
          );
          setDeliveredAt(
            toDateInput(value.deliveredAt)
          );
          setNotes(value.notes ?? "");
        }
      } catch (error) {
        console.error(
          "LOAD SHIPMENT ERROR:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Unable to load shipment."
        );
      } finally {
        setLoading(false);
      }
    }

    loadShipment();
  }, [orderNumber]);

  async function saveShipment(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!courier.trim()) {
      alert("Please select or enter a courier.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(
          orderNumber
        )}/shipment`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            courier,
            trackingNumber,
            status,
            currentLocation,
            shippedAt:
              shippedAt || null,
            estimatedDelivery:
              estimatedDelivery || null,
            deliveredAt:
              deliveredAt || null,
            notes,
            eventDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to save shipment."
        );
      }

      setShipment(data.shipment);

      setEventDescription("");

      alert("Shipment information saved.");
    } catch (error) {
      console.error(
        "SAVE SHIPMENT ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to save shipment."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="mt-7 border border-[#e2e8f0] bg-[#ffffff] p-7">
        <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
          Shipment & Tracking
        </p>

        <p className="mt-5 text-sm text-[#475569]">
          Loading shipment information...
        </p>
      </section>
    );
  }

  return (
    <section className="mt-7 border border-[#e2e8f0] bg-[#ffffff]">
      <div className="border-b border-[#e2e8f0] px-6 py-5">
        <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
          Shipment & Tracking
        </p>

        <h2 className="mt-2 font-serif text-3xl font-bold">
          DELIVERY INFORMATION
        </h2>
      </div>

      <form
        onSubmit={saveShipment}
        className="space-y-6 p-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-[#475569]">
              Courier
            </label>

            <select
              value={courier}
              onChange={(event) =>
                setCourier(event.target.value)
              }
              className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none"
            >
              <option value="">
                Select Courier
              </option>
              <option value="DHL">DHL</option>
              <option value="FedEx">FedEx</option>
              <option value="UPS">UPS</option>
              <option value="USPS">USPS</option>
              <option value="India Post">
                India Post
              </option>
              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-[#475569]">
              Tracking Number
            </label>

            <input
              value={trackingNumber}
              onChange={(event) =>
                setTrackingNumber(
                  event.target.value
                )
              }
              placeholder="Enter tracking number"
              className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-[#475569]">
            Shipment Status
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as (typeof STATUSES)[number]
              )
            }
            className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none"
          >
            {STATUSES.map((value) => (
              <option
                key={value}
                value={value}
              >
                {value.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-[#475569]">
              Shipped Date
            </label>

            <input
              type="date"
              value={shippedAt}
              onChange={(event) =>
                setShippedAt(
                  event.target.value
                )
              }
              className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b]"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-[#475569]">
              Estimated Delivery
            </label>

            <input
              type="date"
              value={estimatedDelivery}
              onChange={(event) =>
                setEstimatedDelivery(
                  event.target.value
                )
              }
              className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b]"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-[#475569]">
              Delivered Date
            </label>

            <input
              type="date"
              value={deliveredAt}
              onChange={(event) =>
                setDeliveredAt(
                  event.target.value
                )
              }
              className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-[#475569]">
            Current Location
          </label>

          <input
            value={currentLocation}
            onChange={(event) =>
              setCurrentLocation(
                event.target.value
              )
            }
            placeholder="Example: Dubai, UAE"
            className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-[#475569]">
            Tracking Event Description
          </label>

          <input
            value={eventDescription}
            onChange={(event) =>
              setEventDescription(
                event.target.value
              )
            }
            placeholder="Example: Package departed DHL facility."
            className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none"
          />

          <p className="mt-2 text-xs text-[#475569]">
            Add a description when you want to create a
            tracking timeline update.
          </p>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-[#475569]">
            Shipment Notes
          </label>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={4}
            placeholder="Internal or customer-facing shipment notes"
            className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-[#0284c7] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#17130d] disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : shipment
              ? "Update Shipment"
              : "Create Shipment"}
        </button>
      </form>

      {shipment &&
        shipment.events.length > 0 && (
          <div className="border-t border-[#e2e8f0] p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
              Tracking History
            </p>

            <div className="mt-6 space-y-5">
              {shipment.events.map(
                (event) => (
                  <div
                    key={event.id}
                    className="border-l border-[#6b5b3e] pl-5"
                  >
                    <div className="flex flex-wrap justify-between gap-3">
                      <strong className="text-[#0877b9]">
                        {event.status.replaceAll(
                          "_",
                          " "
                        )}
                      </strong>

                      <span className="text-xs text-[#475569]">
                        {new Date(
                          event.eventTime
                        ).toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-[#b8b0a2]">
                      {event.description}
                    </p>

                    {event.location && (
                      <p className="mt-1 text-xs text-[#475569]">
                        {event.location}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </section>
  );
}
