"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export default function ImageManager({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [altText, setAltText] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function uploadImage(file: File) {
    setMessage("");
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("altText", altText.trim());

      const response = await fetch(
        `/api/admin/products/${productId}/images`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to upload image."
        );
      }

      setAltText("");
      setMessage("Image uploaded successfully.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload image."
      );
    } finally {
      setSaving(false);
    }
  }

  async function setPrimary(imageId: string) {
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/images`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageId,
            isPrimary: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to set primary image."
        );
      }

      setMessage("Primary image updated.");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update image."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteImage(imageId: string) {
    const confirmed = window.confirm(
      "Delete this image?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");
    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/images?imageId=${encodeURIComponent(
          imageId
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to delete image."
        );
      }

      setMessage("Image deleted.");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete image."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8">
      {message && (
        <div className="mb-5 border border-[#cbd5e1] bg-[#17140f] px-4 py-3 text-sm text-[#0877b9]">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 border border-[#5b352d] bg-[#211411] px-4 py-3 text-sm text-[#d79b8d]">
          {error}
        </div>
      )}

      {/* Upload */}
      <div className="border border-[#4a4031] bg-[#f8fafc] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#475569]">
              Upload Images
            </p>
            <p className="mt-1 text-sm text-[#aaa194]">
              Select an image directly from your computer.
            </p>
          </div>

          <span className="text-[10px] uppercase tracking-[0.15em] text-[#625c53]">
            Max 10 MB
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_280px_auto]">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                uploadImage(file);
              }
            }}
            disabled={saving}
            className="w-full cursor-pointer border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-sm text-[#aaa194] file:mr-4 file:border-0 file:bg-[#0284c7] file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:text-[#17130d] hover:file:bg-[#dfc17d] disabled:opacity-50"
          />

          <input
            value={altText}
            onChange={(event) =>
              setAltText(event.target.value)
            }
            placeholder="Image description (optional)"
            className="border border-[#4a4031] bg-[#ffffff] px-4 py-3 text-sm text-[#17212b] outline-none focus:border-[#0284c7]"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={saving}
            className="bg-[#0284c7] px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-[#17130d] hover:bg-[#dfc17d] disabled:opacity-50"
          >
            {saving ? "Uploading..." : "Choose Image"}
          </button>
        </div>

        <p className="mt-3 text-xs text-[#625c53]">
          JPG, JPEG, PNG, WebP, GIF or AVIF.
        </p>
      </div>

      {/* Image grid */}
      {images.length === 0 ? (
        <div className="mt-6 border border-dashed border-[#4a4031] px-6 py-12 text-center text-sm text-[#475569]">
          No product images yet.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden border border-[#e2e8f0] bg-[#f8fafc]"
            >
              <div className="aspect-square bg-[#17140f]">
                <img
                  src={image.url}
                  alt={
                    image.altText ||
                    "Product image"
                  }
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-4">
                <p className="truncate text-xs text-[#475569]">
                  {image.altText ||
                    "No alt text"}
                </p>

                {image.isPrimary && (
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#0877b9]">
                    Primary Image
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  {!image.isPrimary && (
                    <button
                      type="button"
                      onClick={() =>
                        setPrimary(image.id)
                      }
                      disabled={saving}
                      className="flex-1 border border-[#cbd5e1] px-3 py-2 text-[10px] uppercase tracking-[0.1em] hover:border-[#0877b9] hover:text-[#0877b9] disabled:opacity-50"
                    >
                      Make Primary
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      deleteImage(image.id)
                    }
                    disabled={saving}
                    className="border border-[#5b352d] px-3 py-2 text-[10px] uppercase tracking-[0.1em] text-[#d79b8d] hover:bg-[#211411] disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
