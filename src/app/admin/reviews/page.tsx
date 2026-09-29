import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import ReviewActions from "./ReviewActions";

export default async function AdminReviewsPage() {
  const authenticated = await requireAdmin();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const reviews = await prisma.review.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      customer: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  const pendingReviews = reviews.filter(
    (review) => !review.approved
  );

  const approvedReviews = reviews.filter(
    (review) => review.approved
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <header className="border-b border-[#e2e8f0]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#0369a1]">
              Store Administration
            </p>

            <h1 className="mt-1 font-serif text-2xl font-bold tracking-[0.08em]">
              CUSTOMER REVIEWS
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
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
            Customer Feedback
          </p>

          <h2 className="mt-3 font-serif text-5xl font-bold">
            REVIEWS
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#475569]">
            Review customer feedback before publishing it on the
            storefront.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <StatCard
            label="Pending Reviews"
            value={pendingReviews.length.toString()}
          />

          <StatCard
            label="Approved Reviews"
            value={approvedReviews.length.toString()}
          />
        </div>

        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#0369a1]">
                Awaiting Approval
              </p>

              <h3 className="mt-2 font-serif text-3xl font-bold">
                PENDING REVIEWS
              </h3>
            </div>

            <span className="text-sm text-[#475569]">
              {pendingReviews.length} reviews
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {pendingReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
              />
            ))}

            {pendingReviews.length === 0 && (
              <div className="border border-[#e2e8f0] bg-[#ffffff] px-6 py-16 text-center text-[#475569]">
                No pending reviews.
              </div>
            )}
          </div>
        </section>

        <section className="mt-14">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#0369a1]">
                Published
              </p>

              <h3 className="mt-2 font-serif text-3xl font-bold">
                APPROVED REVIEWS
              </h3>
            </div>

            <span className="text-sm text-[#475569]">
              {approvedReviews.length} reviews
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {approvedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
              />
            ))}

            {approvedReviews.length === 0 && (
              <div className="border border-[#e2e8f0] bg-[#ffffff] px-6 py-16 text-center text-[#475569]">
                No approved reviews yet.
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function ReviewCard({
  review,
}: {
  review: {
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
    approved: boolean;
    createdAt: Date;
    product: {
      id: string;
      name: string;
      slug: string;
    };
    customer: {
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  };
}) {
  return (
    <article className="border border-[#e2e8f0] bg-[#ffffff] p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/products/${review.product.slug}`}
              className="font-serif text-xl font-bold text-[#0877b9] hover:text-[#075985]"
            >
              {review.product.name}
            </Link>

            <span className="border border-[#cbd5e1] px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-[#475569]">
              {review.approved ? "Approved" : "Pending"}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xl">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={
                  index < review.rating
                    ? "text-[#0877b9]"
                    : "text-[#403a32]"
                }
              >
                {String.fromCharCode(
                  index < review.rating ? 9733 : 9734
                )}
              </span>
            ))}
          </div>

          {review.title && (
            <h4 className="mt-5 text-lg font-semibold text-[#17212b]">
              {review.title}
            </h4>
          )}

          {review.comment && (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#aaa194]">
              {review.comment}
            </p>
          )}

          <div className="mt-6 border-t border-[#e2e8f0] pt-4">
            <p className="text-xs uppercase tracking-[0.15em] text-[#0369a1]">
              Customer
            </p>

            {review.customer ? (
              <div className="mt-2">
                <p className="text-sm font-medium">
                  {review.customer.firstName}{" "}
                  {review.customer.lastName}
                </p>

                <p className="mt-1 text-xs text-[#475569]">
                  {review.customer.email}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-[#475569]">
                Customer account unavailable
              </p>
            )}
          </div>
        </div>

        <time
          dateTime={review.createdAt.toISOString()}
          className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-[#625c53]"
        >
          {review.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
      {!review.approved && (
        <div className="mt-6 flex gap-3 border-t border-[#e2e8f0] pt-5">
          <ReviewActions reviewId={review.id} />
        </div>
      )}
    </article>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-[#e2e8f0] bg-[#ffffff] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-[#475569]">
        {label}
      </p>

      <p className="mt-4 font-serif text-3xl font-bold text-[#0877b9]">
        {value}
      </p>
    </div>
  );
}
