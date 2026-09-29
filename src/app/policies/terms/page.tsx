import type { Metadata } from "next";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";


export const metadata: Metadata = {
  title: "Terms & Conditions | Industrial Automation",
  description: "Review the terms and conditions that apply when using the Industrial Automation website and purchasing products.",
  alternates: {
    canonical: "/policies/terms",
  },
};
export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <StoreHeader />

      <section className="border-b border-[#e2e8f0] bg-[#ffffff] px-4 py-14 sm:px-6 sm:py-18">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0369a1]">
            Customer Information
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
            Terms & Conditions
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#475569]">
            These terms describe the general conditions that apply when using
            the Industrial Automation website and purchasing products from our store.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-10">

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Use of Our Website
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              By using this website, you agree to use it lawfully and in a
              manner that does not interfere with the operation, security or
              availability of the website or its services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Products & Product Information
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-[#475569]">
              <p>
                We make reasonable efforts to ensure that product descriptions,
                photographs, specifications and prices displayed on the
                website are accurate.
              </p>

              <p>
                However, colors, finishes, textures and other visual details
                may appear differently depending on your device or screen.
              </p>

              <p>
                Product availability may change without notice.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Pricing
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              Prices displayed on the website are subject to change. We
              reserve the right to correct pricing, product information or
              other errors where necessary.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Orders
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-[#475569]">
              <p>
                Placing an order constitutes a request to purchase the selected
                products. An order may be subject to verification and
                acceptance.
              </p>

              <p>
                We may contact you if additional information is required to
                process an order.
              </p>

              <p>
                We reserve the right to decline or cancel an order where
                necessary, including in cases involving suspected fraud,
                incorrect pricing, unavailable products or other legitimate
                reasons.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Custom Products
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-[#475569]">
              <p>
                Some products may be available with custom sizing or
                made-to-measure options.
              </p>

              <p>
                Customers are responsible for providing accurate measurements
                and information required for a custom order.
              </p>

              <p>
                Custom products may have different cancellation and return
                conditions. Please review our applicable policies before
                ordering.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Payment
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              Orders must be paid using an available payment method offered
              during checkout. Payment processing may be handled by a
              third-party payment provider and may be subject to that
              provider&apos;s terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Shipping & Delivery
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              Shipping and delivery are subject to our Shipping Policy.
              Delivery estimates are not guaranteed and may be affected by
              customs, carriers, weather, transportation issues or other
              circumstances outside our control.
            </p>

            <Link
              href="/policies/shipping"
              className="mt-5 inline-flex text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0877b9] hover:text-[#dfc17d]"
            >
              Read Shipping Policy
            </Link>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Returns, Refunds & Cancellations
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              Returns, refunds and cancellations are governed by the applicable
              store policies published on this website.
            </p>

            <div className="mt-5 flex flex-wrap gap-5">
              <Link
                href="/policies/returns"
                className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0877b9] hover:text-[#dfc17d]"
              >
                Returns & Refunds
              </Link>

              <Link
                href="/policies/cancellation"
                className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0877b9] hover:text-[#dfc17d]"
              >
                Cancellation Policy
              </Link>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Intellectual Property
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              Website content, including text, photographs, graphics, logos,
              designs and other materials, may be protected by applicable
              intellectual property laws. Content may not be copied,
              reproduced or commercially used without appropriate permission.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Prohibited Activities
            </h2>

            <div className="mt-4 space-y-3 text-sm leading-7 text-[#475569]">
              <p>
                You must not use the website to:
              </p>

              <ul className="list-disc space-y-2 pl-5">
                <li>Engage in fraudulent or unlawful activity.</li>
                <li>Attempt to gain unauthorized access to our systems.</li>
                <li>Interfere with website security or functionality.</li>
                <li>Submit misleading or fraudulent information.</li>
                <li>Abuse, disrupt or overload website services.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Limitation of Liability
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              To the extent permitted by applicable law, Industrial Automation will
              not be responsible for indirect, incidental or consequential
              losses arising from the use of the website or services.
              Nothing in these terms is intended to exclude rights or
              protections that cannot legally be excluded.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Changes to These Terms
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              We may update these Terms & Conditions when necessary. Updated
              terms will be published on this page and will apply from the
              effective date stated or otherwise indicated.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Questions
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              If you have questions about these terms, please contact our
              customer support team.
            </p>

            <a
              href="/request-quote?subject=Terms%20Question"
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

