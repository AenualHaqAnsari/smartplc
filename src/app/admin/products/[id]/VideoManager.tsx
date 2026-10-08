"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ProductVideo = { id: string; url: string; title: string | null; sortOrder: number; createdAt: string };

export default function VideoManager({ productId, videos }: { productId: string; videos: ProductVideo[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function upload() {
    const file = selectedFile;
    if (!file) { setError("Choose a video file first."); return; }
    setMessage("");
    setError("");
    if (!(file.type === "video/mp4" || file.type === "video/webm")) { setError("Please select an MP4 or WebM video."); return; }
    if (file.size <= 0 || file.size > 100 * 1024 * 1024) { setError("Video must be no more than 100 MB."); return; }
    setSaving(true);
    setProgress(0);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/admin/products/${productId}/videos`);
    xhr.upload.onprogress = (event) => { if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100)); };
    xhr.onload = () => {
      let data: { error?: string } = {};
      try { data = JSON.parse(xhr.responseText) as { error?: string }; } catch { /* handled below */ }
      if (xhr.status < 200 || xhr.status >= 300) setError(data.error || "Unable to upload video.");
      else { setMessage("Video uploaded successfully."); setTitle(""); setSelectedFile(null); if (fileRef.current) fileRef.current.value = ""; router.refresh(); }
      setSaving(false);
    };
    xhr.onerror = () => { setError("Upload failed. Check your connection and try again."); setSaving(false); };
    xhr.send(formData);
  }

  async function update(videoId: string, values: { title?: string; sortOrder?: number }) {
    setMessage(""); setError(""); setSaving(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}/videos`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ videoId, ...values }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to update video.");
      setMessage("Video details updated."); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to update video."); }
    finally { setSaving(false); }
  }

  async function remove(videoId: string) {
    if (!window.confirm("Delete this product video?")) return;
    setMessage(""); setError(""); setSaving(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}/videos?videoId=${encodeURIComponent(videoId)}`, { method: "DELETE" });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to delete video.");
      setMessage("Video deleted."); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to delete video."); }
    finally { setSaving(false); }
  }

  return <div className="mt-7">
    {message && <p role="status" className="mb-4 border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-sm text-[#0877b9]">{message}</p>}
    {error && <p role="alert" className="mb-4 border border-[#5b352d] bg-[#211411] px-4 py-3 text-sm text-[#d79b8d]">{error}</p>}
    <div className="border border-[#cbd5e1] bg-[#f8fafc] p-5">
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input ref={fileRef} type="file" accept="video/mp4,video/webm" disabled={saving} onChange={(event) => { const file = event.target.files?.[0]; if (file) { setSelectedFile(file); setMessage(""); setError(""); } }} className="w-full border border-[#cbd5e1] bg-white px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-[#0284c7] file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:text-white disabled:opacity-50" aria-label="Choose product video" />
        <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} placeholder="Video title or caption (optional)" disabled={saving} className="border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#0284c7] disabled:opacity-50" />
        <button type="button" disabled={saving || !selectedFile} onClick={upload} className="bg-[#0284c7] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white hover:bg-[#075985] disabled:opacity-50">{saving && progress > 0 ? `Uploading ${progress}%` : saving ? "Saving…" : "Upload Video"}</button>
      </div>
      {selectedFile && <p className="mt-3 text-xs text-[#475569]">Selected: {selectedFile.name} · {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>}
      <p className="mt-3 text-xs text-[#625c53]">MP4 or WebM · Maximum 100 MB</p>
      {saving && progress > 0 && <progress className="mt-3 h-2 w-full accent-[#0284c7]" max={100} value={progress} aria-label={`Upload progress ${progress}%`} />}
    </div>
    {videos.length === 0 ? <p className="mt-5 border border-dashed border-[#cbd5e1] px-6 py-10 text-center text-sm text-[#475569]">No product videos yet.</p> : <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => <article key={video.id} className="overflow-hidden border border-[#e2e8f0] bg-white">
        <video controls preload="metadata" playsInline className="aspect-video w-full bg-black" aria-label={video.title || "Product demonstration video"}><source src={video.url} type={video.url.endsWith(".webm") ? "video/webm" : "video/mp4"} />Your browser does not support HTML video.</video>
        <div className="space-y-3 p-4">
          <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#475569]">Title
            <input key={`${video.id}-${video.title ?? ""}`} defaultValue={video.title ?? ""} maxLength={200} placeholder="Add a title" disabled={saving} onBlur={(event) => { const next = event.currentTarget.value.trim() || ""; if (next !== (video.title ?? "")) update(video.id, { title: next }); }} className="mt-1 w-full border border-[#cbd5e1] px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#17212b] disabled:opacity-50" />
          </label>
          <div className="flex items-center justify-between gap-3 text-xs text-[#625c53]"><label>Display order <input aria-label={`Display order for ${video.title || "video"}`} type="number" min={0} defaultValue={video.sortOrder} disabled={saving} onBlur={(event) => { const next = Number(event.currentTarget.value); if (Number.isSafeInteger(next) && next >= 0 && next !== video.sortOrder) update(video.id, { sortOrder: next }); }} className="ml-2 w-20 border border-[#cbd5e1] px-2 py-1 text-[#17212b] disabled:opacity-50" /></label><span>{new Date(video.createdAt).toLocaleDateString()}</span></div>
          <button type="button" onClick={() => remove(video.id)} disabled={saving} className="w-full border border-[#cbd5e1] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#9b3d32] hover:border-[#9b3d32] disabled:opacity-50">Delete Video</button>
        </div>
      </article>)}
    </div>}
  </div>;
}
