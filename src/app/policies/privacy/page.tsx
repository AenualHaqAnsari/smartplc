import type { Metadata } from "next";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";


export const metadata: Metadata = {
  title: "Privacy Policy | Industrial Automation",
  description: "Learn how Industrial Automation collects, uses and protects information provided through our website and orders.",
  alternates: {
    canonical: "/policies/privacy",
  },
};
export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <StoreHeader />

      <section className="border-b border-[#e2e8f0] bg-[#ffffff] px-4 py-14 sm:px-6 sm:py-18">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0369a1]">
            Customer Information
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#475569]">
            This policy explains how Industrial Automation may collect, use and
            protect information provided when you use our website or place an
            order.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-10">

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Information We Collect
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-[#475569]">
              <p>
                When you create an account, place an order or contact us, we
                may collect information such as your name, email address,
                telephone number, shipping address and order details.
              </p>

              <p>
                For custom-size products, we may also collect measurements or
                sizing information that you voluntarily provide for the
                purpose of preparing your order.
              </p>

              <p>
                We may also receive technical information necessary for the
                operation, security and improvement of our website.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              How We Use Your Information
            </h2>

            <div className="mt-4 space-y-3 text-sm leading-7 text-[#475569]">
              <p>We may use information to:</p>

              <ul className="list-disc space-y-2 pl-5">
                <li>Process and fulfill orders.</li>
                <li>Deliver products to the address provided.</li>
                <li>Provide order and shipment updates.</li>
                <li>Respond to customer support requests.</li>
                <li>Provide custom products according to submitted measurements.</li>
                <li>Maintain and secure customer accounts.</li>
                <li>Prevent fraud, abuse or unauthorized activity.</li>
                <li>Operate and improve our website and services.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Payment Information
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              Payments may be processed through third-party payment providers.
              Payment information may be handled directly by the applicable
              payment provider according to its own privacy and security
              policies. We do not need to store your complete payment card
              details in order to process your order.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Order & Shipping Information
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              We may share necessary delivery information with shipping
              carriers or service providers when required to fulfill and
              deliver an order. This may include your name, delivery address,
              telephone number and tracking-related information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Customer Accounts
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              If you create a customer account, information associated with
              your account may be stored so that you can view orders, manage
              account information and use available store features.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Cookies & Similar Technologies
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              Our website may use cookies or similar technologies that are
              necessary for website functionality, account sessions, shopping
              features, security and other legitimate website operations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Information Security
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              We take reasonable measures to protect customer information
              against unauthorized access, misuse, alteration or disclosure.
              However, no method of transmitting or storing information over
              the internet can be guaranteed to be completely secure.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Information Retention
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              We may retain customer and order information for as long as
              reasonably necessary to provide our services, maintain business
              records, resolve disputes, comply with legal obligations and
              protect our legitimate interests.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Your Privacy Choices
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              Depending on applicable law, you may have rights relating to
              your personal information, including rights to request access,
              correction or deletion of certain information. Requests can be
              submitted to our customer support team.
            </p>

            <a
              href="/request-quote?subject=Privacy%20Request"
              className="mt-5 inline-flex bg-[#0877b9] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffffff] transition hover:bg-[#075985]"
            >
              Contact Privacy Support
            </a>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">
              Changes to This Policy
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#475569]">
              We may update this Privacy Policy from time to time to reflect
              changes to our website, services or legal requirements. Any
              updated version will be published on this page.
            </p>
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

