"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, X, Sparkles } from "lucide-react";

export default function ResultPage() {
  const searchParams = useSearchParams();

  const original = searchParams.get("original") || "";
  const result = searchParams.get("result") || "";
  const vibe = searchParams.get("vibe") || "coquette";

  const [imageReady, setImageReady] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadMode, setDownloadMode] = useState("9:16");
  const [customWidth, setCustomWidth] = useState("1080");
  const [customHeight, setCustomHeight] = useState("1920");

  const vibeName = vibe
    .split("+")
    .join(" + ")
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

  useEffect(() => {
    if (!result) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const maxAttempts = 30;

    const tryLoadImage = (currentAttempt: number) => {
      if (cancelled) return;

      setAttempt(currentAttempt);

      if (currentAttempt > maxAttempts) {
        setImageError(true);
        return;
      }

      const img = new Image();

      img.onload = () => {
        if (cancelled) return;

        setImageReady(true);
        setImageError(false);
      };

      img.onerror = () => {
        if (cancelled) return;

        timeoutId = setTimeout(() => {
          tryLoadImage(currentAttempt + 1);
        }, 3000);
      };

      const cacheBuster = result.includes("?") ? "&" : "?";

      img.src = `${result}${cacheBuster}v=${Date.now()}`;
    };

    tryLoadImage(1);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [result]);

  useEffect(() => {
    if (!imageReady || !result) return;

    try {
      const key = "vibeshift-history";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");

      if (Array.isArray(existing) && !existing.some((item) => item.result === result)) {
        const next = [
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            original,
            result,
            vibe,
            createdAt: Date.now(),
          },
          ...existing,
        ].slice(0, 20);

        localStorage.setItem(key, JSON.stringify(next));
      }
    } catch (error) {
      console.error("History save error:", error);
    }
  }, [imageReady, result, original, vibe]);

  const tryAnotherVibeHref = original
    ? `/?image=${encodeURIComponent(original)}&fileName=${encodeURIComponent(
        "Previous image"
      )}`
    : "/";

  const buildDownloadUrl = (ratio: string, width: number, height: number) => {
    if (!result) return "";

    const marker = "/image/upload/";
    const markerIndex = result.indexOf(marker);

    if (markerIndex === -1) return result;

    const baseUrl = result.slice(0, markerIndex);
    const rest = result.slice(markerIndex + marker.length);
    const firstSlash = rest.indexOf("/");

    if (firstSlash === -1) return result;

    const existingTransformation = rest.slice(0, firstSlash);
    const imagePath = rest.slice(firstSlash + 1);
    const transformation = `ar_${ratio},c_fill,g_auto,w_${width}`;

    return `${baseUrl}${marker}${existingTransformation}/${transformation}/fl_attachment/${imagePath}`;
  };

  const handleDownload = () => {
    let ratio = downloadMode;
    let width = 1080;
    let height = 1080;

    if (downloadMode === "9:16") {
      width = 1080;
      height = 1920;
    } else if (downloadMode === "4:5") {
      width = 1080;
      height = 1350;
    } else if (downloadMode === "1:1") {
      width = 1080;
      height = 1080;
    } else if (downloadMode === "16:9") {
      width = 1920;
      height = 1080;
    } else if (downloadMode === "3:4") {
      width = 1080;
      height = 1440;
    } else {
      width = Math.max(100, Number(customWidth) || 1080);
      height = Math.max(100, Number(customHeight) || 1080);
      ratio = `${width}:${height}`;
    }

    const downloadUrl = buildDownloadUrl(ratio, width, height);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `vibeshift-${downloadMode}.jpg`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setShowDownloadModal(false);
  };

  return (
    <main className="min-h-screen bg-[#FFF8F4] px-6 py-10 text-[#5A2A3E]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="font-serif text-4xl">
            Your{" "}
            <span className="italic text-[#E8829F]">
              {vibeName}
            </span>{" "}
            world
          </h1>

          <span className="shrink-0 text-sm">
            🔒 Subject preserved
          </span>
        </div>

        <div className="grid overflow-hidden rounded-[20px] border border-[#F2C9D5] bg-white md:grid-cols-2">
          <div>
            <div className="border-b border-[#F2C9D5] px-4 py-3 text-sm">
              Original
            </div>

            {original && (
              <img
                src={original}
                alt="Original"
                className="aspect-square w-full object-contain"
              />
            )}
          </div>

          <div>
            <div className="border-b border-[#F2C9D5] px-4 py-3 text-sm">
              VibeShift
            </div>

            <div className="relative flex aspect-square w-full items-center justify-center bg-white">
              {!imageReady && !imageError && (
                <div className="flex flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 h-9 w-9 animate-spin rounded-full border-2 border-[#F2C9D5] border-t-[#E8829F]" />

                  <p className="text-sm font-medium text-[#5A2A3E]">
                    Creating your world...
                  </p>

                  <p className="mt-1 max-w-[300px] text-xs leading-5 text-[#8A5A6C]">
                    Your subject is preserved while the environment is transformed.
                  </p>

                  <p className="mt-3 text-[10px] text-[#B58A99]">
                    This can take a little while
                  </p>
                </div>
              )}

              {imageReady && result && (
                <img
                  src={result}
                  alt="VibeShift result"
                  className="h-full w-full object-cover"
                />
              )}

              {imageError && (
                <div className="px-6 text-center">
                  <div className="mb-3 text-2xl">✨</div>

                  <p className="text-sm font-medium text-[#5A2A3E]">
                    We couldn't load your transformed world.
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#8A5A6C]">
                    The image generation may have taken too long.
                    Please try the vibe again.
                  </p>

                  <Link
                    href={tryAnotherVibeHref}
                    className="mt-5 inline-flex rounded-full bg-[#E8829F] px-5 py-2.5 text-xs font-medium text-white"
                  >
                    Try another vibe
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={tryAnotherVibeHref}
            className="rounded-full border border-[#E8B7C5] px-5 py-3 text-sm transition hover:bg-white"
          >
            ← Try another vibe
          </Link>

          {imageReady && result && (
            <button
              onClick={() => setShowDownloadModal(true)}
              className="flex items-center gap-2 rounded-full bg-[#E8829F] px-5 py-3 text-sm font-medium text-white transition hover:brightness-95"
            >
              <Download size={15} />
              Download
            </button>
          )}
        </div>

        {showDownloadModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#3D2430]/25 p-3 backdrop-blur-[3px] sm:items-center sm:p-6">
            <div className="w-full max-w-[620px] overflow-hidden rounded-[26px] border bg-[#FFF8F4] shadow-2xl" style={{ borderColor: "#F0CCD7" }}>
              <div className="flex items-start justify-between border-b px-5 py-5 sm:px-6" style={{ borderColor: "#F2D8DF" }}>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: "#E8829F" }}>
                    Save your world
                  </p>
                  <h2 className="mt-1 text-[25px]" style={{ fontFamily: "var(--font-fraunces)", color: "#5A2A3E" }}>
                    Choose your ratio.
                  </h2>
                  <p className="mt-1 text-[12px]" style={{ color: "#8A5A6C" }}>
                    Pick a format for Instagram, social posts or wherever you want to use it.
                  </p>
                </div>
                <button onClick={() => setShowDownloadModal(false)} className="flex h-9 w-9 items-center justify-center rounded-full border transition hover:bg-white" style={{ borderColor: "#F0CCD7", color: "#8A5A6C" }}>
                  <X size={16} />
                </button>
              </div>

              <div className="px-5 py-5 sm:px-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["9:16", "Instagram Story / Reel", "1080 × 1920"],
                    ["4:5", "Instagram Portrait Post", "1080 × 1350"],
                    ["1:1", "Square Post", "1080 × 1080"],
                    ["16:9", "Landscape / YouTube", "1920 × 1080"],
                    ["3:4", "Portrait", "1080 × 1440"],
                    ["custom", "Custom ratio", "Choose your size"],
                  ].map(([value, label, size]) => {
                    const active = downloadMode === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setDownloadMode(value)}
                        className="rounded-[16px] border p-3 text-left transition"
                        style={{
                          borderColor: active ? "#E8829F" : "#F0DCE2",
                          backgroundColor: active ? "#FDEEF2" : "#FFFFFF",
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[12px] font-medium" style={{ color: "#5A2A3E" }}>{label}</span>
                          <span className="rounded-full bg-white px-2 py-1 text-[9px]" style={{ color: "#8A5A6C" }}>{value}</span>
                        </div>
                        <p className="mt-1 text-[10px]" style={{ color: "#A47A89" }}>{size}</p>
                      </button>
                    );
                  })}
                </div>

                {downloadMode === "custom" && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <label className="text-[11px]" style={{ color: "#5A2A3E" }}>
                      Width
                      <input value={customWidth} onChange={(e) => setCustomWidth(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" className="mt-1 w-full rounded-[14px] border bg-white px-3 py-2.5 text-[12px] outline-none" style={{ borderColor: "#F0CCD7", color: "#5A2A3E" }} />
                    </label>
                    <label className="text-[11px]" style={{ color: "#5A2A3E" }}>
                      Height
                      <input value={customHeight} onChange={(e) => setCustomHeight(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" className="mt-1 w-full rounded-[14px] border bg-white px-3 py-2.5 text-[12px] outline-none" style={{ borderColor: "#F0CCD7", color: "#5A2A3E" }} />
                    </label>
                  </div>
                )}

                <div className="mt-4 rounded-[15px] border px-4 py-3" style={{ borderColor: "#F0DCE2", backgroundColor: "#FDEEF2" }}>
                  <p className="text-[10px] leading-5" style={{ color: "#5A2A3E" }}>
                    ✨ VibeShift will resize your generated world to the selected format without stretching it. Cloudinary handles the aspect-ratio transformation at delivery time.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t px-5 py-4 sm:px-6" style={{ borderColor: "#F2D8DF" }}>
                <button onClick={() => setShowDownloadModal(false)} className="rounded-full px-4 py-2.5 text-[12px]" style={{ color: "#8A5A6C" }}>
                  Cancel
                </button>
                <button onClick={handleDownload} className="flex items-center gap-2 rounded-full bg-[#E8829F] px-5 py-2.5 text-[12px] font-medium text-white">
                  <Download size={14} />
                  Download image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
