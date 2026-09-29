import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import SettingsForm from "./SettingsForm";
import ClearTestOrders from "./ClearTestOrders";

export default async function AdminSettingsPage() {
  const authenticated = await requireAdmin();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const settings = await prisma.storeSetting.findMany({
    where: {
      key: {
        in: [
          "india_tax_rate",
          "international_tax_rate",
          "free_shipping", "discount_india", "discount_united_kingdom", "discount_germany", "discount_france", "discount_italy", "discount_belgium", "discount_spain", "discount_switzerland", "discount_united_states", "discount_everywhere",
          ],
      },
    },
  });

  const settingMap = new Map(
    settings.map((setting) => [
      setting.key,
      setting.value,
    ])
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <header className="border-b border-[#e2e8f0]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
              Store Administration
            </p>

            <h1 className="mt-1 font-serif text-2xl font-bold tracking-[0.08em]">
              INDUSTRIAL AUTOMATION
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#075985]"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/products"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#075985]"
            >
              Products
            </Link>

            <Link
              href="/"
              className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#075985]"
            >
              View Store
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
          Configuration
        </p>

        <h2 className="mt-3 font-serif text-5xl font-bold">
          STORE SETTINGS
        </h2>

        <p className="mt-5 max-w-2xl leading-7 text-[#475569]">
          Configure tax rates and shipping settings used
          when calculating customer orders.
        </p>

        <div className="mt-10 border border-[#e2e8f0] bg-[#ffffff] p-7">
          <SettingsForm
            initialDiscountIndia={settingMap.get("discount_india") ?? "0"}
            initialIndiaTaxRate={
              settingMap.get("india_tax_rate") ?? "17"
            }
            initialInternationalTaxRate={
              settingMap.get(
                "international_tax_rate"
              ) ?? "0"
            }
            initialFreeShipping={settingMap.get("free_shipping") !== "false"}
            initialDiscountUnitedKingdom={settingMap.get("discount_united_kingdom") ?? "0"}
            initialDiscountGermany={settingMap.get("discount_germany") ?? "0"}
            initialDiscountFrance={settingMap.get("discount_france") ?? "0"}
            initialDiscountItaly={settingMap.get("discount_italy") ?? "0"}
            initialDiscountBelgium={settingMap.get("discount_belgium") ?? "0"}
            initialDiscountSpain={settingMap.get("discount_spain") ?? "0"}
            initialDiscountSwitzerland={settingMap.get("discount_switzerland") ?? "0"}
            initialDiscountUnitedStates={settingMap.get("discount_united_states") ?? "0"}
            initialDiscountEverywhere={settingMap.get("discount_everywhere") ?? "0"}
          />
        </div>

        <ClearTestOrders />
      </section>
    </main>
  );
}
