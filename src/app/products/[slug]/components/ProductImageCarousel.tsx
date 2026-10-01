"use client";

import { useEffect, useState } from "react";

type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
};

type ProductImageCarouselProps = {
  images: ProductImage[];
  productName: string;
  category: string;
};

export default function ProductImageCarousel({
  images,
  productName,
  category,
}: ProductImageCarouselProps) {
  const primaryImage =
    images.find((image) => image.isPrimary) ?? images[0];

  const primaryIndex = Math.max(
    0,
    images.findIndex(
      (image) => image.id === primaryImage?.id
    )
  );

  const [activeIndex, setActiveIndex] =
    useState(primaryIndex);

  const [isPaused, setIsPaused] =
    useState(false);

  useEffect(() => {
    setActiveIndex(primaryIndex);
  }, [primaryIndex, primaryImage?.id]);

  const hasMultipleImages =
    images.length > 1;

  function previousImage() {
    setActiveIndex((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    );
  }

  function nextImage() {
    setActiveIndex((current) =>
      current === images.length - 1
        ? 0
        : current + 1
    );
  }

  useEffect(() => {
    if (
      !hasMultipleImages ||
      isPaused
    ) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setActiveIndex((current) =>
          current === images.length - 1
            ? 0
            : current + 1
        );
      }, 5000);

    return () =>
      window.clearInterval(timer);
  }, [
    images.length,
    hasMultipleImages,
    isPaused,
  ]);

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center border border-[#e2e8f0] bg-[#171512]">
        <span className="font-serif text-2xl text-[#4b4439]">
          INDUSTRIAL AUTOMATION
        </span>
      </div>
    );
  }

  const currentImage =
    images[activeIndex] ?? images[0];

  /*
   * Keep four thumbnails visible.
   *
   * The thumbnail window follows the active image
   * so the previews remain useful when there are
   * more than four product images.
   */
  let thumbnailStart = 0;

  if (images.length > 4) {
    thumbnailStart =
      Math.min(
        Math.max(
          activeIndex - 1,
          0
        ),
        images.length - 4
      );
  }

  const thumbnailImages =
    images.slice(
      thumbnailStart,
      thumbnailStart + 4
    );

  return (
    <div
      onMouseEnter={() =>
        setIsPaused(true)
      }
      onMouseLeave={() =>
        setIsPaused(false)
      }
      className="select-none"
    >
      {/* Main Product Image */}

      <div className="relative mx-auto aspect-square w-full max-w-[600px] overflow-hidden border border-[#e2e8f0] bg-[#171512]">
        <img
          key={currentImage.id}
          src={currentImage.url}
          alt={
            currentImage.altText ||
            productName
          }
          className="h-full w-full object-contain transition-opacity duration-300"
        />

        {/* Category Badge */}

        <div className="absolute left-4 top-4 border border-[#6b5b3e] bg-black/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#0877b9] backdrop-blur">
          {category}
        </div>

        {hasMultipleImages && (
          <>
            {/* Previous Image */}

            <button
              type="button"
              onClick={
                previousImage
              }
              aria-label="Previous product image"
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/45 text-3xl text-white backdrop-blur transition hover:bg-black/70"
            >
              &#8249;
            </button>

            {/* Next Image */}

            <button
              type="button"
              onClick={nextImage}
              aria-label="Next product image"
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/45 text-3xl text-white backdrop-blur transition hover:bg-black/70"
            >
              &#8250;
            </button>

            {/* Image Counter */}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 border border-white/20 bg-black/60 px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-white backdrop-blur">
              {activeIndex + 1} /{" "}
              {images.length}
            </div>
          </>
        )}
      </div>

      {/* Large Thumbnail Row */}

      {hasMultipleImages && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {thumbnailImages.map(
            (image) => {
              const imageIndex =
                images.findIndex(
                  (item) =>
                    item.id === image.id
                );

              const isActive =
                imageIndex ===
                activeIndex;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      imageIndex
                    )
                  }
                  aria-label={`View image ${
                    imageIndex + 1
                  }`}
                  className={`group relative w-full overflow-hidden border transition ${
                    isActive
                      ? "border-2 border-[#0284c7]"
                      : "border border-[#e2e8f0] hover:border-[#6b5b3e]"
                  }`}
                >
                  <div className="aspect-[3/2] w-full overflow-hidden bg-[#171512]">
                    <img
                      src={image.url}
                      alt={
                        image.altText ||
                        `${productName} image ${
                          imageIndex + 1
                        }`
                      }
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    />
                  </div>

                  {/* Active Thumbnail Indicator */}

                  {isActive && (
                    <div className="absolute inset-0 border-2 border-[#d6b875]" />
                  )}
                </button>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
