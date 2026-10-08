type ProductVideo = { id: string; url: string; title: string | null; sortOrder: number };

export default function ProductVideoGallery({ videos, poster, productName }: { videos: ProductVideo[]; poster?: string; productName: string }) {
  if (videos.length === 0) return null;
  return <section aria-labelledby="product-videos-heading" className="mx-auto max-w-[1400px] px-4 pb-12 sm:px-6">
    <div className="mb-6 border-b border-slate-200 pb-4">
      <p className="text-xs uppercase tracking-[0.3em] text-sky-800">Product demonstration</p>
      <h2 id="product-videos-heading" className="mt-2 font-serif text-2xl font-bold text-slate-900">WORKING MACHINE VIDEOS</h2>
    </div>
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {videos.map((video, index) => <figure key={video.id} className="overflow-hidden border border-slate-200 bg-white">
        <video controls preload="metadata" playsInline poster={poster} aria-label={video.title || `${productName} demonstration video ${index + 1}`} className="aspect-video w-full bg-black">
          <source src={video.url} type={video.url.endsWith(".webm") ? "video/webm" : "video/mp4"} />
          Your browser does not support HTML video.
        </video>
        <figcaption className="p-4 text-sm font-medium text-slate-800">{video.title || `${productName} demonstration`}</figcaption>
      </figure>)}
    </div>
  </section>;
}
