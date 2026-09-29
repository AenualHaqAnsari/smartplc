"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AnalyticsData = {
  success: boolean;

  summary: {
    totalVisitors: number;
    visitorsToday: number;
    totalPageViews: number;
    pageViewsToday: number;
    uniqueVisitors24h: number;
    liveVisitors: number;
  };

  hourlyTraffic: {
    hour: string;
    label: string;
    visitors: number;
    pageViews: number;
  }[];

  topPages: {
    path: string;
    views: number;
  }[];

  countries: {
    country: string | null;
    visitors: number;
  }[];

  devices: {
    device: string | null;
    visitors: number;
  }[];

  browsers: {
    browser: string | null;
    visitors: number;
  }[];

  topProducts: {
  productId: string;
  name: string;
  slug: string | null;
  views: number;
}[];

  recentPageViews: {
    path: string;
    createdAt: string;
    visitorId: string;
    productId: string | null;
  }[];
};

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortId(value: string) {
  return value.length > 14
    ? `${value.slice(0, 14)}...`
    : value;
}

function percentage(
  value: number,
  total: number
) {
  if (!total) return 0;

  return Math.round((value / total) * 100);
}

export default function AnalyticsPage() {
  const [data, setData] =
    useState<AnalyticsData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadAnalytics(
    showRefresh = false
  ) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      }

      setError("");

      const response = await fetch(
        "/api/admin/analytics",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load analytics"
        );
      }

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.error ||
            "Failed to load analytics"
        );
      }

      setData(result);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load analytics data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    const initialLoad = window.setTimeout(() => { void loadAnalytics(); }, 0);
    const interval = setInterval(() => loadAnalytics(), 30000);
    return () => { window.clearTimeout(initialLoad); clearInterval(interval); };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f1e7] p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-[#d8c8aa] bg-[#fbf8f1] p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#075985]">
              Website Intelligence
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-[#302719]">
              Loading analytics...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f6f1e7] p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-xl font-semibold text-red-800">
              Analytics unavailable
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error ||
                "Unable to load analytics."}
            </p>

            <button
              onClick={() =>
                loadAnalytics(true)
              }
              className="mt-5 rounded-lg bg-[#5d4727] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#47361f]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Visitors Today",
      value: data.summary.visitorsToday,
      description:
        "New customer visitors since midnight",
    },
    {
      title: "Total Visitors",
      value: data.summary.totalVisitors,
      description:
        "Customer visitors recorded",
    },
    {
      title: "Page Views Today",
      value: data.summary.pageViewsToday,
      description:
        "Customer pages viewed today",
    },
    {
      title: "Total Page Views",
      value: data.summary.totalPageViews,
      description:
        "Customer page views recorded",
    },
    {
      title: "Unique · 24 Hours",
      value:
        data.summary.uniqueVisitors24h,
      description:
        "Unique customer visitors",
    },
    {
      title: "Live Visitors",
      value: data.summary.liveVisitors,
      description:
        "Active customer visitors",
      live: true,
    },
  ];

  const maxPageViews = Math.max(
    ...data.hourlyTraffic.map(
      (item) => item.pageViews
    ),
    1
  );

  const totalCountryVisitors =
    data.countries.reduce(
      (sum, item) =>
        sum + item.visitors,
      0
    );

  const totalDeviceVisitors =
    data.devices.reduce(
      (sum, item) =>
        sum + item.visitors,
      0
    );

  const totalBrowserVisitors =
    data.browsers.reduce(
      (sum, item) =>
        sum + item.visitors,
      0
    );

  return (
    <div className="min-h-screen bg-[#f6f1e7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="rounded-2xl border border-[#d8c8aa] bg-[#fbf8f1] p-6 shadow-sm">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-2.5 w-2.5 rounded-full bg-[#6f8f52]" />

                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#075985]">
                  Customer Analytics
                </p>

              </div>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#302719]">
                Website Analytics
              </h1>

              <p className="mt-1 text-sm text-[#756954]">
                Real customer traffic and visitor
                intelligence.
              </p>

            </div>

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">

                <p className="text-[10px] uppercase tracking-[0.15em] text-[#9a8b72]">
                  Auto refresh
                </p>

                <p className="text-xs text-[#665a48]">
                  Every 30 seconds
                </p>

              </div>

              <div className="flex items-center gap-3">
  <Link
    href="/admin"
    className="inline-flex items-center gap-2 rounded-lg border border-[#cdbb9a] bg-[#f8f2e6] px-4 py-2.5 text-sm font-medium text-[#5d4727] transition hover:bg-[#eee3d0]"
  >
    ← Dashboard
  </Link>

  <button
    onClick={() =>
      loadAnalytics(true)
    }
    disabled={refreshing}
    className="rounded-lg border border-[#cdbb9a] bg-[#f8f2e6] px-4 py-2.5 text-sm font-medium text-[#5d4727] transition hover:bg-[#eee3d0] disabled:opacity-60"
  >
    {refreshing
      ? "Refreshing..."
      : "Refresh"}
  </button>
</div>

            </div>

          </div>

        </div>

        {/* SUMMARY */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {cards.map((card) => (

            <div
              key={card.title}
              className="rounded-2xl border border-[#d8c8aa] bg-[#fbf8f1] p-5 shadow-sm"
            >

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#075985]">
                    {card.title}
                  </p>

                  <p className="mt-3 text-3xl font-semibold tracking-tight text-[#302719]">
                    {card.value.toLocaleString()}
                  </p>

                </div>

                {card.live && (
                  <span className="flex items-center gap-1.5 rounded-full border border-[#c8d5ba] bg-[#edf4e7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#55703d]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#6f8f52]" />
                    Live
                  </span>
                )}

              </div>

              <p className="mt-3 text-xs text-[#8b7d68]">
                {card.description}
              </p>

            </div>

          ))}

        </div>

        {/* TRAFFIC + LIVE */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          <div className="lg:col-span-2 rounded-2xl border border-[#d8c8aa] bg-[#fbf8f1] p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#075985]">
                  Traffic Overview
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#302719]">
                  Customer activity
                </h2>

              </div>

              <span className="rounded-full bg-[#eee3d0] px-3 py-1 text-xs text-[#756954]">
                Last 24 hours
              </span>

            </div>

            <div className="mt-8 flex h-52 items-end gap-1 border-b border-[#ded3c0]">

              {data.hourlyTraffic.map(
                (item) => {

                  const height =
                    item.pageViews === 0
                      ? 2
                      : Math.max(
                          (item.pageViews /
                            maxPageViews) *
                            100,
                          5
                        );

                  return (
                    <div
                      key={item.hour}
                      className="group relative flex h-full flex-1 items-end"
                    >

                      <div
                        className="w-full rounded-t bg-[#9b7b43] transition hover:bg-[#765b32]"
                        style={{
                          height:
                            `${height}%`,
                        }}
                      />

                      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#302719] px-3 py-2 text-[10px] text-white shadow-lg group-hover:block">

                        <div className="font-semibold">
                          {item.label}
                        </div>

                        <div className="mt-1 text-[#dfcda9]">
                          {item.pageViews} page views
                        </div>

                        <div className="text-[#cbb995]">
                          {item.visitors} visitors
                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

            <div className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-[#9a8b72]">
              <span>24h ago</span>
              <span>12h ago</span>
              <span>Now</span>
            </div>

            <p className="mt-5 text-xs text-[#8b7d68]">
              Real customer page views recorded
              during the last 24 hours.
            </p>

          </div>

          <div className="rounded-2xl border border-[#d8c8aa] bg-[#fbf8f1] p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#075985]">
                  Live Activity
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#302719]">
                  Right now
                </h2>

              </div>

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf4e7] text-[#55703d]">
                ●
              </span>

            </div>

            <div className="mt-6 rounded-xl border border-[#d8c8aa] bg-[#f6f1e7] p-5 text-center">

              <p className="text-4xl font-semibold text-[#302719]">
                {data.summary.liveVisitors}
              </p>

              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[#8b7d68]">
                Active customers
              </p>

            </div>

            <div className="mt-5 space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-[#756954]">
                  Unique · 24h
                </span>

                <span className="font-semibold text-[#302719]">
                  {data.summary.uniqueVisitors24h}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#756954]">
                  Views today
                </span>

                <span className="font-semibold text-[#302719]">
                  {data.summary.pageViewsToday}
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* CUSTOMER BREAKDOWN */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* COUNTRIES */}

          <div className="rounded-2xl border border-[#d8c8aa] bg-[#fbf8f1] p-6 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#075985]">
              Geography
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[#302719]">
              Top Countries
            </h2>

            <div className="mt-5 space-y-4">

              {data.countries.length === 0 ? (

                <p className="text-sm text-[#8b7d68]">
                  Country information will appear
                  as new customers visit.
                </p>

              ) : (

                data.countries.map(
                  (item) => {

                    const percent =
                      percentage(
                        item.visitors,
                        totalCountryVisitors
                      );

                    return (
                      <div
                        key={
                          item.country ||
                          "unknown"
                        }
                      >

                        <div className="flex items-center justify-between text-sm">

                          <span className="font-medium text-[#403522]">
                            {item.country ||
                              "Unknown"}
                          </span>

                          <span className="text-xs text-[#756954]">
                            {item.visitors} ·{" "}
                            {percent}%
                          </span>

                        </div>

                        <div className="mt-2 h-1.5 rounded-full bg-[#e8dece]">

                          <div
                            className="h-full rounded-full bg-[#9b7b43]"
                            style={{
                              width:
                                `${percent}%`,
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )

              )}

            </div>

          </div>

          {/* DEVICES */}

          <div className="rounded-2xl border border-[#d8c8aa] bg-[#fbf8f1] p-6 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#075985]">
              Technology
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[#302719]">
              Devices
            </h2>

            <div className="mt-5 space-y-4">

              {data.devices.length === 0 ? (

                <p className="text-sm text-[#8b7d68]">
                  Device information will appear
                  as customers visit.
                </p>

              ) : (

                data.devices.map(
                  (item) => {

                    const percent =
                      percentage(
                        item.visitors,
                        totalDeviceVisitors
                      );

                    return (
                      <div
                        key={
                          item.device ||
                          "unknown"
                        }
                      >

                        <div className="flex justify-between text-sm">

                          <span className="font-medium text-[#403522]">
                            {item.device ||
                              "Unknown"}
                          </span>

                          <span className="text-xs text-[#756954]">
                            {item.visitors} ·{" "}
                            {percent}%
                          </span>

                        </div>

                        <div className="mt-2 h-1.5 rounded-full bg-[#e8dece]">

                          <div
                            className="h-full rounded-full bg-[#765b32]"
                            style={{
                              width:
                                `${percent}%`,
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )

              )}

            </div>

          </div>

          {/* BROWSERS */}

          <div className="rounded-2xl border border-[#d8c8aa] bg-[#fbf8f1] p-6 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#075985]">
              Technology
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[#302719]">
              Browsers
            </h2>

            <div className="mt-5 space-y-4">

              {data.browsers.length === 0 ? (

                <p className="text-sm text-[#8b7d68]">
                  Browser information will appear
                  as customers visit.
                </p>

              ) : (

                data.browsers.map(
                  (item) => {

                    const percent =
                      percentage(
                        item.visitors,
                        totalBrowserVisitors
                      );

                    return (
                      <div
                        key={
                          item.browser ||
                          "unknown"
                        }
                      >

                        <div className="flex justify-between text-sm">

                          <span className="font-medium text-[#403522]">
                            {item.browser ||
                              "Unknown"}
                          </span>

                          <span className="text-xs text-[#756954]">
                            {item.visitors} ·{" "}
                            {percent}%
                          </span>

                        </div>

                        <div className="mt-2 h-1.5 rounded-full bg-[#e8dece]">

                          <div
                            className="h-full rounded-full bg-[#0877b9]"
                            style={{
                              width:
                                `${percent}%`,
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )

              )}

            </div>

          </div>

        </div>

        {/* TOP PAGES */}

        <div className="mt-6 rounded-2xl border border-[#d8c8aa] bg-[#fbf8f1] p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#075985]">
                Content Performance
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#302719]">
                Top Pages
              </h2>

            </div>

            <span className="text-xs text-[#8b7d68]">
              Last 24 hours
            </span>

          </div>

          {data.topPages.length === 0 ? (

            <div className="mt-6 rounded-xl border border-dashed border-[#d8c8aa] p-8 text-center">

              <p className="text-sm text-[#8b7d68]">
                No customer page activity
                recorded yet.
              </p>

            </div>

          ) : (

            <div className="mt-5 overflow-hidden rounded-xl border border-[#ded3c0]">

              {data.topPages.map(
                (page, index) => {

                  const maximum =
                    data.topPages[0]
                      ?.views || 1;

                  const width =
                    (page.views /
                      maximum) *
                    100;

                  return (
                    <div
                      key={page.path}
                      className="border-b border-[#ded3c0] p-4 last:border-b-0"
                    >

                      <div className="flex items-center gap-4">

                        <span className="w-6 text-center text-xs font-semibold text-[#9a8b72]">
                          {index + 1}
                        </span>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-center justify-between gap-4">

                            <span className="truncate text-sm font-medium text-[#403522]">
                              {page.path}
                            </span>

                            <span className="shrink-0 text-sm font-semibold text-[#302719]">
                              {page.views.toLocaleString()}
                            </span>

                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e8dece]">

                            <div
                              className="h-full rounded-full bg-[#9b7b43]"
                              style={{
                                width:
                                  `${width}%`,
                              }}
                            />

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

        {/* TOP PRODUCTS */}

        <div className="mt-6 rounded-2xl border border-[#d8c8aa] bg-[#fbf8f1] p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#075985]">
                Product Interest
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#302719]">
                Most Viewed Products
              </h2>

            </div>

            <span className="text-xs text-[#8b7d68]">
              Customer activity
            </span>

          </div>

          {data.topProducts.length === 0 ? (

            <div className="mt-6 rounded-xl border border-dashed border-[#d8c8aa] p-8 text-center">

              <p className="text-sm text-[#8b7d68]">
                No product views recorded yet.
              </p>

            </div>

          ) : (

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {data.topProducts.map(
                (product, index) => {

                  const maximum =
                    data.topProducts[0]
                      ?.views || 1;

                  const width =
                    (product.views /
                      maximum) *
                    100;

                  return (
                    <div
                      key={product.productId}
                      className="rounded-xl border border-[#ded3c0] bg-[#f6f1e7] p-4"
                    >

                      <div className="flex items-center justify-between">

                        <span className="text-xs font-semibold text-[#9a8b72]">
                          #{index + 1}
                        </span>

                        <span className="text-sm font-semibold text-[#302719]">
                          {product.views} views
                        </span>

                      </div>

                      <p className="mt-3 truncate text-sm font-medium text-[#403522]">
  {product.name}
</p>

{product.slug && (
  <p className="mt-1 truncate font-mono text-[10px] text-[#8b7d68]">
    /products/{product.slug}
  </p>
)}

                      <div className="mt-3 h-1.5 rounded-full bg-[#e2d7c6]">

                        <div
                          className="h-full rounded-full bg-[#765b32]"
                          style={{
                            width:
                              `${width}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

        {/* RECENT ACTIVITY */}

        <div className="mt-6 rounded-2xl border border-[#d8c8aa] bg-[#fbf8f1] p-6 shadow-sm">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#075985]">
              Customer Activity Log
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[#302719]">
              Recent Activity
            </h2>

          </div>

          <div className="mt-5 overflow-x-auto">

            <table className="w-full min-w-[650px] text-left">

              <thead>

                <tr className="border-b border-[#ded3c0] text-[10px] uppercase tracking-[0.15em] text-[#9a8b72]">

                  <th className="px-3 py-3">
                    Time
                  </th>

                  <th className="px-3 py-3">
                    Page
                  </th>

                  <th className="px-3 py-3">
                    Visitor
                  </th>

                  <th className="px-3 py-3">
                    Product
                  </th>

                </tr>

              </thead>

              <tbody>

                {data.recentPageViews.map(
                  (view, index) => (

                    <tr
                      key={`${view.createdAt}-${index}`}
                      className="border-b border-[#eee6d8] last:border-b-0"
                    >

                      <td className="px-3 py-3 text-xs text-[#756954]">
                        {formatTime(
                          view.createdAt
                        )}
                      </td>

                      <td className="max-w-[280px] truncate px-3 py-3 text-sm font-medium text-[#403522]">
                        {view.path}
                      </td>

                      <td className="px-3 py-3 font-mono text-[10px] text-[#8b7d68]">
                        {shortId(
                          view.visitorId
                        )}
                      </td>

                      <td className="px-3 py-3 text-xs text-[#8b7d68]">
                        {view.productId
                          ? shortId(
                              view.productId
                            )
                          : "—"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

        <div className="pb-8 pt-5 text-center text-[10px] uppercase tracking-[0.14em] text-[#a2947e]">
          Customer analytics · Automatically refreshed
          every 30 seconds
        </div>

      </div>
    </div>
  );
}