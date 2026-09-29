import type { Metadata } from "next";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";


export const metadata: Metadata = {
  title: "Cancellation Policy | Industrial Automation",
  description: "Review the Industrial Automation order cancellation policy and requirements before requesting cancellation.",
  alternates: {
    canonical: "/policies/cancellation",
  },
};
export default function CancellationPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <StoreHeader />

      <section className="border-b border-[#e2e8f0] bg-[#ffffff] px-4 py-14 sm:px-6 sm:py-18">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0369a1]">
            Customer Information
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
            Cancellation Policy
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#475569]">
            Please review this policy before requesting cancellation of an
            order.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-10">

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Requesting a Cancellation
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-[#475569]">
              <p>
                If you need to cancel an order, please contact us as soon as
                possible and provide your order number.
              </p>

              <p>
                We will review the order status and determine whether
                cancellation is still possible.
              </p>

              <p>
                A cancellation request does not automatically guarantee that
                an order can be cancelled.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Orders That Have Not Been Processed
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              If an order has not yet entered preparation or production, we
              will make reasonable efforts to accommodate a cancellation
              request.
            </p>
          </section>

          <section className="border border-[#cbd5e1] bg-[#ffffff] p-6 sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#0369a1]">
              Custom Orders
            </p>

            <h2 className="mt-3 font-serif text-2xl font-bold">
              Custom-Size & Made-to-Measure Products
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-[#475569]">
              <p>
                Custom-size and made-to-measure products may enter preparation
                or production specifically for the customer shortly after the
                order is confirmed.
              </p>

              <p>
                Once preparation or production has started, cancellation may
                no longer be possible or may be subject to additional
                conditions.
              </p>

              <p>
                If you have ordered a custom product and need to request a
                cancellation, contact us immediately so we can check the
                current production status.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Orders Already Shipped
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              Orders that have already been shipped generally cannot be
              cancelled through the normal cancellation process. Depending on
              the circumstances, the order may instead be subject to the
              applicable return policy.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Approved Cancellations & Refunds
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-[#475569]">
              <p>
                If a cancellation is approved and a refund is applicable, the
                refund will normally be processed through the original payment
                method where possible.
              </p>

              <p>
                The time required for the refund to appear may depend on the
                payment provider or financial institution.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              How to Request Cancellation
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              Send us your order number and cancellation request as soon as
              possible. Please do not wait until the order has been shipped.
            </p>

            <a
              href="/request-quote?subject=Order%20Cancellation%20Request"
              className="mt-5 inline-flex bg-[#0877b9] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffffff] transition hover:bg-[#075985]"
            >
              Request Cancellation
            </a>
          </section>

        </div>
      </section>

      <footer className="border-t border-[#e2e8f0] px-4 py-8 text-center text-xs text-[#777064]">
        <p>Industrial Automation</p>

        <p className="mt-2">
          Industrial automation products and engineering services.
        </p>
      </footer>
          <SiteFooter />
    </main>
  );
}


