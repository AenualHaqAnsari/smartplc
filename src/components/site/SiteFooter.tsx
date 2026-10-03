import Link from "next/link";

const products = [["PLC", "plc"], ["HMI", "hmi"], ["VFD & Drives", "vfd-drives"], ["Servo Systems", "servo-systems"], ["Sensors", "sensors"], ["Control Panels", "control-panels"]];
const services = ["PLC Programming", "HMI & SCADA", "VFD & Servo", "Machine Automation", "Panel Engineering", "Commissioning & Troubleshooting"];
const contactNumbers = ["7456812005", "9759629484"];

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#101c2b] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-9 px-5 py-12 sm:px-8 md:grid-cols-4">
        <div>
          <Link href="/" className="font-bold tracking-wide text-white">INDUSTRIAL AUTOMATION</Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">Industrial control products and automation engineering services for manufacturing and machine applications.</p>
          <Link href="/about" className="mt-4 inline-block text-sm font-semibold text-sky-300">About us →</Link>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-white">Products</h2>
          <div className="mt-4 space-y-2.5 text-sm">
            {products.map(([name, slug]) => <Link key={slug} href={`/products?category=${slug}`} className="block hover:text-sky-300">{name}</Link>)}
            <Link href="/products" className="block hover:text-sky-300">All products</Link>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-white">Services</h2>
          <div className="mt-4 space-y-2.5 text-sm">
            {services.map((service) => <Link key={service} href={`/request-quote?service=${encodeURIComponent(service)}`} className="block hover:text-sky-300">{service}</Link>)}
            <Link href="/industrial-automation" className="block hover:text-sky-300">Industrial automation</Link>
            <Link href="/applications" className="block hover:text-sky-300">Automation applications</Link>
            <Link href="/request-quote" className="block font-semibold text-sky-300">Request a quote</Link>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-white">Contact & Support</h2>
          <div className="mt-4 space-y-2.5 text-sm">
            <Link href="/contact" className="block hover:text-sky-300">Contact</Link>
            {contactNumbers.map((number) => (
              <div key={number} className="flex flex-wrap gap-x-3">
                <a href={`tel:+91${number}`} className="hover:text-sky-300">Call: +91 {number}</a>
                <a href={`https://wa.me/91${number}`} target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-white">WhatsApp</a>
              </div>
            ))}
            <Link href="/faq" className="block hover:text-sky-300">FAQ</Link>
            <Link href="/track-order" className="block hover:text-sky-300">Track an order</Link>
            <Link href="/policies/shipping" className="block hover:text-sky-300">Shipping policy</Link>
            <Link href="/policies/returns" className="block hover:text-sky-300">Returns</Link>
            <Link href="/policies/privacy" className="block hover:text-sky-300">Privacy policy</Link>
            <Link href="/policies/terms" className="block hover:text-sky-300">Terms</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-slate-400 sm:flex-row sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} Industrial Automation. All rights reserved.</span>
          <span>Secure checkout · Product support · Quote enquiries</span>
        </div>
      </div>
    </footer>
  );
}

