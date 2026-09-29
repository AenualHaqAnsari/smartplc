"use client";

import { useState } from "react";

type SettingsFormProps = {
  initialIndiaTaxRate: string;
  initialInternationalTaxRate: string;
  initialFreeShipping: boolean;
  initialDiscountIndia: string;
  initialDiscountUnitedKingdom: string;
  initialDiscountGermany: string;
  initialDiscountFrance: string;
  initialDiscountItaly: string;
  initialDiscountBelgium: string;
  initialDiscountSpain: string;
  initialDiscountSwitzerland: string;
  initialDiscountUnitedStates: string;
  initialDiscountEverywhere: string;
};

export default function SettingsForm({
  initialIndiaTaxRate,
  initialInternationalTaxRate,
  initialFreeShipping,
  initialDiscountIndia,
  initialDiscountUnitedKingdom, initialDiscountGermany, initialDiscountFrance, initialDiscountItaly, initialDiscountBelgium, initialDiscountSpain, initialDiscountSwitzerland, initialDiscountUnitedStates, initialDiscountEverywhere,
}: SettingsFormProps) {
  const [indiaTaxRate, setIndiaTaxRate] =
    useState(initialIndiaTaxRate);

  const [internationalTaxRate, setInternationalTaxRate] =
    useState(initialInternationalTaxRate);

  const [freeShipping, setFreeShipping] =
    useState(initialFreeShipping);

  const [discountIndia, setDiscountIndia] =
    useState(initialDiscountIndia);

  const [discountUnitedKingdom, setDiscountUnitedKingdom] = useState(initialDiscountUnitedKingdom);
  const [discountGermany, setDiscountGermany] = useState(initialDiscountGermany);
  const [discountFrance, setDiscountFrance] = useState(initialDiscountFrance);
  const [discountItaly, setDiscountItaly] = useState(initialDiscountItaly);
  const [discountBelgium, setDiscountBelgium] = useState(initialDiscountBelgium);
  const [discountSpain, setDiscountSpain] = useState(initialDiscountSpain);
  const [discountSwitzerland, setDiscountSwitzerland] = useState(initialDiscountSwitzerland);
  const [discountUnitedStates, setDiscountUnitedStates] = useState(initialDiscountUnitedStates);
  const [discountEverywhere, setDiscountEverywhere] = useState(initialDiscountEverywhere);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/settings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            indiaTaxRate,
            internationalTaxRate,
            freeShipping,
            discountIndia,
            discountUnitedKingdom, discountGermany, discountFrance, discountItaly, discountBelgium, discountSpain, discountSwitzerland, discountUnitedStates, discountEverywhere,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to save settings."
        );
      }

      setMessage(
        "Settings saved successfully."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <div>
        <label
          htmlFor="indiaTaxRate"
          className="block text-xs uppercase tracking-[0.2em] text-[#0369a1]"
        >
          India GST Rate (%)
        </label>

        <input
          id="indiaTaxRate"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={indiaTaxRate ?? ""}
          onChange={(event) =>
            setIndiaTaxRate(event.target.value)
          }
          className="mt-3 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none focus:border-[#0284c7]"
        />

        <p className="mt-2 text-xs text-[#475569]">
          Current configured rate:{" "}
          {indiaTaxRate ?? "0"}%
        </p>
      </div>

      <div>
        <label
          htmlFor="internationalTaxRate"
          className="block text-xs uppercase tracking-[0.2em] text-[#0369a1]"
        >
          International Tax Rate (%)
        </label>

        <input
          id="internationalTaxRate"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={internationalTaxRate ?? ""}
          onChange={(event) =>
            setInternationalTaxRate(
              event.target.value
            )
          }
          className="mt-3 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none focus:border-[#0284c7]"
        />

        <p className="mt-2 text-xs text-[#475569]">
          Currently 0%. You can change this later
          if international tax becomes applicable.
        </p>
      </div>

      <div className="border-t border-[#e2e8f0] pt-7">
        <label htmlFor="discountIndia" className="block text-xs uppercase tracking-[0.2em] text-[#0369a1]">India Discount (%)</label>
        <input id="discountIndia" type="number" min="0" max="100" step="0.01" value={discountIndia} onChange={(event) => setDiscountIndia(event.target.value)} className="mt-3 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b] outline-none focus:border-[#0284c7]" />
        <p className="mt-2 text-xs text-[#475569]">Discount applied to customers registered in India.</p>
      </div>

      <div className="border-t border-[#e2e8f0] pt-7"><h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#0877b9]">Country Discounts (%)</h3><p className="mt-2 text-xs text-[#475569]">Set a different discount percentage for each country. India uses 0% discount.</p><div className="mt-5 grid gap-5 sm:grid-cols-2"><div><label className="text-xs uppercase tracking-[0.15em] text-[#0369a1]">United Kingdom</label><input type="number" min="0" max="100" step="0.01" value={discountUnitedKingdom} onChange={e=>setDiscountUnitedKingdom(e.target.value)} className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b]"/></div><div><label className="text-xs uppercase tracking-[0.15em] text-[#0369a1]">Germany</label><input type="number" min="0" max="100" step="0.01" value={discountGermany} onChange={e=>setDiscountGermany(e.target.value)} className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b]"/></div><div><label className="text-xs uppercase tracking-[0.15em] text-[#0369a1]">France</label><input type="number" min="0" max="100" step="0.01" value={discountFrance} onChange={e=>setDiscountFrance(e.target.value)} className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b]"/></div><div><label className="text-xs uppercase tracking-[0.15em] text-[#0369a1]">Italy</label><input type="number" min="0" max="100" step="0.01" value={discountItaly} onChange={e=>setDiscountItaly(e.target.value)} className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b]"/></div><div><label className="text-xs uppercase tracking-[0.15em] text-[#0369a1]">Belgium</label><input type="number" min="0" max="100" step="0.01" value={discountBelgium} onChange={e=>setDiscountBelgium(e.target.value)} className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b]"/></div><div><label className="text-xs uppercase tracking-[0.15em] text-[#0369a1]">Spain</label><input type="number" min="0" max="100" step="0.01" value={discountSpain} onChange={e=>setDiscountSpain(e.target.value)} className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b]"/></div><div><label className="text-xs uppercase tracking-[0.15em] text-[#0369a1]">Switzerland</label><input type="number" min="0" max="100" step="0.01" value={discountSwitzerland} onChange={e=>setDiscountSwitzerland(e.target.value)} className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b]"/></div><div><label className="text-xs uppercase tracking-[0.15em] text-[#0369a1]">United States</label><input type="number" min="0" max="100" step="0.01" value={discountUnitedStates} onChange={e=>setDiscountUnitedStates(e.target.value)} className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b]"/></div><div><label className="text-xs uppercase tracking-[0.15em] text-[#0369a1]">Everywhere Else</label><input type="number" min="0" max="100" step="0.01" value={discountEverywhere} onChange={e=>setDiscountEverywhere(e.target.value)} className="mt-2 w-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[#17212b]"/></div></div></div><div className="border-t border-[#e2e8f0] pt-7">
        <label className="flex cursor-pointer items-center gap-4">
          <input
            type="checkbox"
            checked={Boolean(freeShipping)}
            onChange={(event) =>
              setFreeShipping(
                event.target.checked
              )
            }
            className="h-5 w-5 accent-[#0284c7]"
          />

          <span>
            <span className="block text-sm font-semibold">
              Free Worldwide Shipping
            </span>

            <span className="mt-1 block text-xs text-[#475569]">
              Shipping cost will remain $0 when
              enabled.
            </span>
          </span>
        </label>
      </div>

      {message && (
        <div className="border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-sm text-[#0877b9]">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="bg-[#0284c7] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#17130d] transition hover:bg-[#dfc17d] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}