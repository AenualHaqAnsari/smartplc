"use client";

import { useState } from "react";

type Props = {
  src: string | null;
  alt: string;
  fallbackLabel: string;
};

export default function ProductCardImage({ src, alt, fallbackLabel }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="mb-3 flex aspect-[3/2] w-full items-center justify-center overflow-hidden bg-slate-100">
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="px-3 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
          {fallbackLabel}
        </span>
      )}
    </div>
  );
}
