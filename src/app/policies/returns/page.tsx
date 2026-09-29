import type { Metadata } from "next";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";


export const metadata: Metadata = {
  title: "Returns & Refunds Policy | Industrial Automation",
  description: "Review the Industrial Automation returns and refunds policy before placing your order.",
  alternates: {
    canonical: "/policies/returns",
  },
};
export default function ReturnsPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <StoreHeader />

      <section className="border-b border-[#e2e8f0] bg-[#ffffff] px-4 py-14 sm:px-6 sm:py-18">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0369a1]">
            Customer Information
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
            Returns & Refunds
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#475569]">
            We want you to be confident when ordering from Industrial Automation.
            Please review the following information before placing your order.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-10">

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Before Requesting a Return
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              Please contact us before sending any product back. We will
              provide instructions for the return and confirm whether the
              order is eligible for a return or refund.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Standard Products
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-[#475569]">
              <p>
                Standard products may be eligible for return if they are
                unused, undamaged and returned in their original condition.
              </p>

              <p>
                Products that have been used, altered, damaged or modified
                after delivery may not be eligible for a return.
              </p>

              <p>
                Return eligibility may also depend on the product category and
                the circumstances of the order. Please contact us before
                shipping anything back.
              </p>
            </div>
          </section>

          <section className="border border-[#cbd5e1] bg-[#ffffff] p-6 sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#0369a1]">
              Important
            </p>

            <h2 className="mt-3 font-serif text-2xl font-bold">
              Custom Configured Products
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-[#475569]">
              <p>
                Custom-sized or made-to-measure products are prepared
                specifically according to the measurements or specifications
                provided by the customer.
              </p>

              <p>
                Because these products are made specifically for an individual
                order, they may have different return or cancellation
                conditions from standard products.
              </p>

              <p>
                Please carefully review your measurements and order details
                before confirming a custom order.
              </p>

              <p>
                If you believe a custom product has been made incorrectly or
                does not correspond to the confirmed specifications, contact
                us as soon as possible so we can review the issue.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Damaged or Incorrect Products
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-[#475569]">
              <p>
                If your order arrives damaged or you receive an incorrect
                product, please contact us as soon as possible after delivery.
              </p>

              <p>
                Please include your order number and clear photographs showing
                the condition of the package and product. This helps us
                investigate the issue and determine the appropriate solution.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Refunds
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-[#475569]">
              <p>
                When a refund is approved, the refund will normally be
                processed through the original payment method where possible.
              </p>

              <p>
                The time required for the refund to appear in your account may
                depend on your payment provider or financial institution.
              </p>

              <p>
                Shipping charges and other fees may be non-refundable where
                applicable.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Return Shipping
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              Unless the return is the result of an error on our part or an
              approved damaged-product claim, return shipping costs may be the
              responsibility of the customer.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Exchanges
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              Exchanges are not automatically guaranteed and depend on product
              availability, condition and the circumstances of the request.
              Please contact customer support before sending a product back.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              How to Contact Us
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              To request a return, report a damaged product or ask about a
              refund, contact us with your order number and a description of
              the issue.
            </p>

            <a
              href="/request-quote?subject=Return%20or%20Refund%20Request"
              className="mt-5 inline-flex bg-[#0877b9] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffffff] transition hover:bg-[#075985]"
            >
              Contact Support
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


