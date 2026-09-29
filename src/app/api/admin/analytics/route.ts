import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOf24Hours = new Date(
      now.getTime() - 24 * 60 * 60 * 1000
    );

    /*
     * Only visitors who have viewed a customer-facing page
     * are considered real website visitors.
     *
     * Admin activity is excluded from analytics.
     */
    const customerVisitorWhere = {
      pageViews: {
        some: {
          NOT: {
            path: {
              startsWith: "/admin",
            },
          },
        },
      },
    };

    const customerPageViewWhere = {
      NOT: {
        path: {
          startsWith: "/admin",
        },
      },
    };

    const [
      totalVisitors,
      visitorsToday,
      totalPageViews,
      pageViewsToday,
      recentPageViews,
      recentVisitors,
      countryGroups,
      deviceGroups,
      browserGroups,
      productViewGroups,
    ] = await Promise.all([
      /*
       * Total customer visitors
       */
      prisma.visitor.count({
        where: customerVisitorWhere,
      }),

      /*
       * New customer visitors today
       */
      prisma.visitor.count({
        where: {
          ...customerVisitorWhere,
          createdAt: {
            gte: startOfToday,
          },
        },
      }),

      /*
       * Total customer page views
       */
      prisma.pageView.count({
        where: customerPageViewWhere,
      }),

      /*
       * Customer page views today
       */
      prisma.pageView.count({
        where: {
          ...customerPageViewWhere,
          createdAt: {
            gte: startOfToday,
          },
        },
      }),

      /*
       * Customer page views during last 24 hours
       */
      prisma.pageView.findMany({
        where: {
          ...customerPageViewWhere,
          createdAt: {
            gte: startOf24Hours,
          },
        },
        select: {
          path: true,
          createdAt: true,
          visitorId: true,
          productId: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5000,
      }),

      /*
       * Customer visitors created during last 24 hours
       */
      prisma.visitor.findMany({
        where: {
          ...customerVisitorWhere,
          createdAt: {
            gte: startOf24Hours,
          },
        },
        select: {
          createdAt: true,
        },
      }),

      /*
       * Countries of customer visitors
       */
      prisma.visitor.groupBy({
        by: ["country"],
        where: {
          ...customerVisitorWhere,
          country: {
            not: null,
          },
        },
        _count: {
          _all: true,
        },
        orderBy: {
          _count: {
            country: "desc",
          },
        },
        take: 10,
      }),

      /*
       * Devices of customer visitors
       */
      prisma.visitor.groupBy({
        by: ["device"],
        where: {
          ...customerVisitorWhere,
          device: {
            not: null,
          },
        },
        _count: {
          _all: true,
        },
        orderBy: {
          _count: {
            device: "desc",
          },
        },
      }),

      /*
       * Browsers of customer visitors
       */
      prisma.visitor.groupBy({
        by: ["browser"],
        where: {
          ...customerVisitorWhere,
          browser: {
            not: null,
          },
        },
        _count: {
          _all: true,
        },
        orderBy: {
          _count: {
            browser: "desc",
          },
        },
      }),

      /*
       * Product views.
       *
       * ProductView itself does not contain a path, so we
       * only count product views belonging to visitors who
       * have customer-facing activity.
       */
      prisma.pageView.groupBy({
  by: ["productId"],
  where: {
    ...customerPageViewWhere,
    productId: {
      not: null,
    },
  },
  _count: {
    _all: true,
  },
  orderBy: {
    _count: {
      productId: "desc",
    },
  },
  take: 10,
}),
    ]);

    /*
     * Build actual 24-hour traffic buckets.
     */
    const hourlyTraffic = Array.from(
      { length: 24 },
      (_, index) => {
        const start = new Date(
          now.getTime() -
            (23 - index) * 60 * 60 * 1000
        );

        start.setMinutes(0, 0, 0);

        const end = new Date(
          start.getTime() + 60 * 60 * 1000
        );

        const pageViews =
          recentPageViews.filter(
            (view) =>
              view.createdAt >= start &&
              view.createdAt < end
          ).length;

        const visitors =
          recentVisitors.filter(
            (visitor) =>
              visitor.createdAt >= start &&
              visitor.createdAt < end
          ).length;

        return {
          hour: start.toISOString(),

          label: start.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),

          visitors,
          pageViews,
        };
      }
    );

    /*
     * Top customer-facing pages.
     */
    const pageCounts = new Map<
      string,
      number
    >();

    for (const view of recentPageViews) {
      pageCounts.set(
        view.path,
        (pageCounts.get(view.path) || 0) + 1
      );
    }

    const topPages = Array.from(
      pageCounts.entries()
    )
      .map(([path, views]) => ({
        path,
        views,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    /*
     * Unique customer visitors during last 24 hours.
     */
    const uniqueVisitors24h = new Set(
      recentPageViews.map(
        (view) => view.visitorId
      )
    ).size;

    /*
     * Visitors active during last 5 minutes.
     *
     * We only count visitors who have customer-facing
     * page activity.
     */
    const liveVisitors =
      await prisma.visitor.count({
        where: {
          ...customerVisitorWhere,
          lastSeen: {
            gte: new Date(
              now.getTime() -
                5 * 60 * 1000
            ),
          },
        },
      });

    const countries = countryGroups.map(
      (item) => ({
        country: item.country,
        visitors: item._count._all,
      })
    );

    const devices = deviceGroups.map(
      (item) => ({
        device: item.device,
        visitors: item._count._all,
      })
    );

    const browsers = browserGroups.map(
      (item) => ({
        browser: item.browser,
        visitors: item._count._all,
      })
    );

    const topProductIds =
  productViewGroups
    .map((item) => item.productId)
    .filter(
      (id): id is string =>
        id !== null
    );

const products =
  topProductIds.length > 0
    ? await prisma.product.findMany({
        where: {
          id: {
            in: topProductIds,
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      })
    : [];

const productMap = new Map(
  products.map((product) => [
    product.id,
    product,
  ])
);

const topProducts =
  productViewGroups.map((item) => {
    const product =
  item.productId
    ? productMap.get(item.productId)
    : undefined;

    return {
      productId: item.productId,
      name:
        product?.name ||
        "Unknown Product",
      slug:
        product?.slug || null,
      views: item._count._all,
    };
  });

    return NextResponse.json({
      success: true,

      summary: {
        totalVisitors,
        visitorsToday,
        totalPageViews,
        pageViewsToday,
        uniqueVisitors24h,
        liveVisitors,
      },

      hourlyTraffic,

      topPages,

      countries,

      devices,

      browsers,

      topProducts,

      recentPageViews:
        recentPageViews.slice(0, 50),
    });
  } catch (error) {
    console.error(
      "ADMIN ANALYTICS ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load analytics",
      },
      {
        status: 500,
      }
    );
  }
}