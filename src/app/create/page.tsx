"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

type Tab = "post" | "reel";

export default function CreatePage() {

  const router = useRouter();
  const [tab, setTab] = useState<Tab>("post");
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [audioTrack, setAudioTrack] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const { startUpload: startImageUpload } = useUploadThing("imageUploader");
  const { startUpload: startVideoUpload } = useUploadThing("videoUploader");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show a local preview so the user can see what they picked
    setPreview(URL.createObjectURL(file));

    // TODO: Upload the file to UploadThing here and save the returned URL.
    // 1. Install: npm install uploadthing @uploadthing/react
    // 2. Create your file router at /src/app/api/uploadthing/core.ts
    // 3. Upload and save the URL:
    //      const [result] = await uploadFiles("imageUploader", { files: [file] });
    //      setUploadedUrl(result.url);

    //hecho

    setUploadedUrl(null);
    setUploading(true);
    setError(null);

    try {
    const startUpload = tab === "post" ? startImageUpload : startVideoUpload;
    const res = await startUpload([file]);
    if (res?.[0]) setUploadedUrl(res[0].ufsUrl);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Error subiendo el archivo");
    setPreview(null);
  } finally {
    setUploading(false);
  }
}

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!preview) { setError("Please select a file."); return; }

    setLoading(true);
    setError(null);

    try {
      if (tab === "post") {
        // TODO: Replace `preview` with the real URL returned by UploadThing after upload.
        // TODO: Change the URL below to your real backend endpoint.
        // Example: fetch("https://your-api.com/posts", { method: "POST", ... })

        //HECHO

        await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: uploadedUrl, caption, location }),
        });
        
        toast("El post fue creado correctamente");

      } else {
        // TODO: Replace `preview` with the real URL returned by UploadThing after upload.
        // TODO: Change the URL below to your real backend endpoint.
        // Example: fetch("https://your-api.com/reels", { method: "POST", ... })

        //hecho

        await fetch("/api/reels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoUrl: uploadedUrl, thumbnailUrl: uploadedUrl, caption, audioTrack }),
        });
    
        toast("El reel fue creado correctamente");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Create new {tab}</h1>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {(["post", "reel"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setPreview(null); setUploadedUrl(null); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
              tab === t ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* File picker */}
        {preview ? (
          <div className="border-2 border-dashed border-gray-300 rounded-xl aspect-square flex flex-col items-center justify-center overflow-hidden relative">
            {tab === "post" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <video src={preview} className="w-full h-full object-cover" muted loop autoPlay playsInline />
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-white text-sm font-semibold">Uploading…</div>
              </div>
            )}
            {!uploading && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPreview(null); setUploadedUrl(null); }}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-black/80"
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          // TODO: Replace this area with <UploadDropzone> from @uploadthing/react
          
          <UploadDropzone
              appearance={{
                container: "border-2 border-dashed border-gray-300 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/60 transition-colors",
                button: "bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors ut-uploading:bg-gray-700",
                label: "text-gray-500 font-semibold text-sm",
                allowedContent: "text-gray-400 text-xs",
              }}
              config={{ mode: "auto" }}
              endpoint={tab === "post" ? "imageUploader" : "videoUploader"}
              content={{ allowedContent: tab === "post" ? "JPEG, PNG, WEBP" : "MP4 o MOV" }}
              onUploadError={(err) => {
                setPreview(null);
                setUploading(false);
                setError(err instanceof Error ? err.message : "Upload failed");
              }}
              onClientUploadComplete={(res) => {
                setUploading(false);
                if (res?.[0]) {
                  setUploadedUrl(res[0].ufsUrl);
                  setPreview(res[0].ufsUrl);
                }
              }}
              onUploadBegin={() => {
                setError(null);
                setUploading(true);
              }}
            />
 
        )}
        <input
          ref={fileRef}
          type="file"
          accept={tab === "post" ? "image/*" : "video/*"}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Caption */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption…"
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none outline-none focus:border-blue-400 transition-colors"
            required
          />
        </div>

        {tab === "post" && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Location (optional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add a location"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        )}

        {tab === "reel" && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Audio track (optional)</label>
            <input
              type="text"
              value={audioTrack}
              onChange={(e) => setAudioTrack(e.target.value)}
              placeholder="e.g. Golden Hour — JVKE"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading || uploading || !caption.trim() || !preview}
          className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-colors disabled:opacity-40"
        >
          {loading ? "Sharing…" : uploading ? "Uploading file…" : `Share ${tab}`}
        </button>
      </form>
    </div>
  );
}