"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Download, X, GripVertical } from "lucide-react";

export default function ResultPage() {
  const searchParams = useSearchParams();

  const original = searchParams.get("original");
  const result = searchParams.get("result");
  const vibe = searchParams.get("vibe") || "your";

  const [imageReady, setImageReady] = useState(false);

  /*
   * ---------------------------------------------------------
   * SLIDER
   * ---------------------------------------------------------
   */

  const [sliderPosition, setSliderPosition] = useState(50);

  const comparisonRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  /*
   * ---------------------------------------------------------
   * DOWNLOAD
   * ---------------------------------------------------------
   */

  const [showDownloadModal, setShowDownloadModal] =
    useState(false);

  const [downloadMode, setDownloadMode] =
    useState("9:16");

  const [downloadTarget, setDownloadTarget] = useState<
    "original" | "vibeshift"
  >("vibeshift");

  const [customWidth, setCustomWidth] =
    useState("1080");

  const [customHeight, setCustomHeight] =
    useState("1080");

  /*
   * ---------------------------------------------------------
   * IMAGE LOADING
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!result) return;

    let attempts = 0;
    let timer: NodeJS.Timeout;

    const checkImage = () => {
      attempts += 1;

      const img = new Image();

      img.onload = () => {
        setImageReady(true);
      };

      img.onerror = () => {
        if (attempts < 30) {
          timer = setTimeout(checkImage, 3000);
        } else {
          setImageReady(true);
        }
      };

      img.src =
        `${result}${result.includes("?") ? "&" : "?"}` +
        `v=${Date.now()}`;
    };

    checkImage();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [result]);

  /*
   * ---------------------------------------------------------
   * SAVE TO HISTORY
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!imageReady || !original || !result) return;

    try {
      const HISTORY_KEY = "vibeshift-history";

      const existing =
        localStorage.getItem(HISTORY_KEY);

      let history = [];

      if (existing) {
        history = JSON.parse(existing);
      }

      const alreadyExists = history.some(
        (item: {
          original: string;
          result: string;
        }) =>
          item.original === original &&
          item.result === result
      );

      if (!alreadyExists) {
        const newItem = {
          id:
            `${Date.now()}-` +
            `${Math.random()
              .toString(36)
              .slice(2)}`,
          original,
          result,
          vibe,
          createdAt: Date.now(),
        };

        const updatedHistory = [
          newItem,
          ...history,
        ].slice(0, 20);

        localStorage.setItem(
          HISTORY_KEY,
          JSON.stringify(updatedHistory)
        );
      }
    } catch (error) {
      console.error(
        "Could not save to history:",
        error
      );
    }
  }, [imageReady, original, result, vibe]);

  /*
   * ---------------------------------------------------------
   * SLIDER
   * ---------------------------------------------------------
   */

  const updateSliderPosition = (clientX: number) => {
    const container = comparisonRef.current;

    if (!container) return;

    const rect =
      container.getBoundingClientRect();

    const position =
      ((clientX - rect.left) / rect.width) * 100;

    const clampedPosition = Math.min(
      100,
      Math.max(0, position)
    );

    setSliderPosition(clampedPosition);
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    isDraggingRef.current = true;

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    updateSliderPosition(event.clientX);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!isDraggingRef.current) return;

    updateSliderPosition(event.clientX);
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    isDraggingRef.current = false;

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Ignore pointer capture errors.
    }
  };

  const handlePointerCancel = () => {
    isDraggingRef.current = false;
  };

  /*
   * ---------------------------------------------------------
   * DOWNLOAD URL
   * ---------------------------------------------------------
   *
   * IMPORTANT:
   *
   * We DO NOT use c_fill here.
   *
   * c_fill crops/zooms the image to fill the requested
   * dimensions.
   *
   * Instead we use:
   *
   * c_pad + b_gen_fill
   *
   * This keeps the ENTIRE image visible and lets
   * Cloudinary generatively extend the surrounding
   * environment to the requested ratio.
   *
   * Example:
   *
   * 1:1 → 1080 x 1080
   * 9:16 → 1080 x 1920
   * 16:9 → 1920 x 1080
   *
   * The subject remains the same size instead of
   * becoming zoomed/cropped.
   */

  const buildDownloadUrl = (
    sourceUrl: string,
    width: number,
    height: number
  ) => {
    if (!sourceUrl) return "";

    const marker = "/image/upload/";

    const markerIndex =
      sourceUrl.indexOf(marker);

    if (markerIndex === -1) {
      return sourceUrl;
    }

    const baseUrl =
      sourceUrl.slice(0, markerIndex);

    const rest =
      sourceUrl.slice(
        markerIndex + marker.length
      );

    const firstSlash =
      rest.indexOf("/");

    if (firstSlash === -1) {
      return sourceUrl;
    }

    const existingTransformation =
      rest.slice(0, firstSlash);

    const imagePath =
      rest.slice(firstSlash + 1);

    /*
     * -------------------------------------------------------
     * GENERATIVE CANVAS EXTENSION
     * -------------------------------------------------------
     *
     * c_pad:
     * keeps the complete original image visible.
     *
     * b_gen_fill:
     * generates realistic pixels in the added area.
     *
     * This is what prevents the subject from being
     * zoomed/cropped for different ratios.
     */

    const transformation =
      `c_pad,w_${width},h_${height},` +
      `b_gen_fill`;

    return (
      `${baseUrl}${marker}` +
      `${existingTransformation}/` +
      `${transformation}/` +
      `fl_attachment/` +
      `${imagePath}`
    );
  };

  /*
   * ---------------------------------------------------------
   * DOWNLOAD
   * ---------------------------------------------------------
   */

  const handleDownload = () => {
    const sourceUrl =
      downloadTarget === "original"
        ? original
        : result;

    if (!sourceUrl) return;

    let width = 1080;
    let height = 1080;

    /*
     * 9:16
     */

    if (downloadMode === "9:16") {
      width = 1080;
      height = 1920;
    }

    /*
     * 4:5
     */

    if (downloadMode === "4:5") {
      width = 1080;
      height = 1350;
    }

    /*
     * 1:1
     */

    if (downloadMode === "1:1") {
      width = 1080;
      height = 1080;
    }

    /*
     * 16:9
     */

    if (downloadMode === "16:9") {
      width = 1920;
      height = 1080;
    }

    /*
     * 3:4
     */

    if (downloadMode === "3:4") {
      width = 1080;
      height = 1440;
    }

    /*
     * CUSTOM
     */

    if (downloadMode === "custom") {
      width = Number(customWidth);
      height = Number(customHeight);

      if (
        !Number.isFinite(width) ||
        !Number.isFinite(height) ||
        width <= 0 ||
        height <= 0
      ) {
        return;
      }
    }

    const downloadUrl =
      buildDownloadUrl(
        sourceUrl,
        width,
        height
      );

    if (!downloadUrl) return;

    const link =
      document.createElement("a");

    link.href = downloadUrl;

    link.download =
      downloadTarget === "original"
        ? `vibeshift-original-${downloadMode}.jpg`
        : `vibeshift-result-${downloadMode}.jpg`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    setShowDownloadModal(false);
  };

  /*
   * ---------------------------------------------------------
   * INVALID RESULT
   * ---------------------------------------------------------
   */

  if (!original || !result) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#fff9f5] px-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#4b2831]">
            Something went wrong
          </h1>

          <p className="mt-2 text-sm text-[#8d6b72]">
            We couldn't load your VibeShift result.
          </p>

          <Link
            href="/"
            className="inline-flex mt-6 rounded-full bg-[#4b2831] px-6 py-3 text-sm font-medium text-white"
          >
            Back to VibeShift
          </Link>
        </div>
      </main>
    );
  }

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (!imageReady) {
    return (
      <main className="min-h-screen bg-[#fff9f5] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-6 h-12 w-12 rounded-full border-2 border-[#edb9c7] border-t-[#7f4352] animate-spin" />

          <h1 className="text-2xl font-semibold text-[#4b2831]">
            Creating your {vibe} world...
          </h1>

          <p className="mt-2 text-sm text-[#9a7b82]">
            Your subject is being preserved while
            the world changes.
          </p>
        </div>
      </main>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN PAGE
   * ---------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-[#fff9f5] text-[#4b2831]">
      <div className="mx-auto w-full max-w-[980px] px-4 py-8 sm:px-6 sm:py-10">

        {/* HEADER */}

        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl">
              Your{" "}
              <span className="italic text-[#e18fa7]">
                {vibe}
              </span>{" "}
              world
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-xs text-[#876b72]">
            <span>🔒</span>
            <span>Subject preserved</span>
          </div>
        </div>

        {/* ===================================================
            BEFORE / AFTER SLIDER
        =================================================== */}

        <div
          ref={comparisonRef}
          className="relative w-full aspect-square overflow-hidden rounded-[24px] border border-[#efcbd5] bg-white shadow-[0_14px_45px_rgba(110,67,80,0.08)] touch-none select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >

          {/* VIBESHIFT */}

          <img
            src={result}
            alt="VibeShift"
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            draggable={false}
          />

          {/* ORIGINAL */}

          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{
              width: `${sliderPosition}%`,
            }}
          >
            <img
              src={original}
              alt="Original"
              className="absolute inset-0 h-full w-full object-cover pointer-events-none"
              style={{
                width:
                  comparisonRef.current
                    ? `${comparisonRef.current.clientWidth}px`
                    : "100%",
                maxWidth: "none",
              }}
              draggable={false}
            />
          </div>

          {/* ORIGINAL LABEL */}

          <div className="pointer-events-none absolute left-4 top-4 z-20">
            <div className="rounded-full border border-[#ead9dd] bg-white/90 px-4 py-2 text-[11px] font-medium tracking-wide text-[#6f555d] shadow-sm backdrop-blur">
              Original
            </div>
          </div>

          {/* VIBESHIFT LABEL */}

          <div className="pointer-events-none absolute right-4 top-4 z-20">
            <div className="rounded-full bg-[#e38da7] px-4 py-2 text-[11px] font-semibold tracking-wide text-white shadow-sm">
              VibeShift
            </div>
          </div>

          {/* DIVIDER */}

          <div
            className="pointer-events-none absolute inset-y-0 z-30 w-px bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.12)]"
            style={{
              left: `${sliderPosition}%`,
              transform: "translateX(-50%)",
            }}
          />

          {/* HANDLE */}

          <div
            className="pointer-events-none absolute top-1/2 z-40 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#e997ae] shadow-[0_5px_20px_rgba(102,53,68,0.25)]"
            style={{
              left: `${sliderPosition}%`,
            }}
          >
            <GripVertical
              size={19}
              strokeWidth={2.5}
              className="text-white"
            />
          </div>

          {/* DRAG HINT */}

          <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2">
            <div className="rounded-full bg-[#4f3039]/80 px-4 py-2 text-[10px] font-medium tracking-[0.08em] text-white backdrop-blur">
              DRAG TO COMPARE
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className="mt-3 flex items-center justify-between gap-4 px-1">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#e08ea5]">
              Before → After
            </p>

            <p className="mt-1 text-xs text-[#8d6f76]">
              Drag the slider to see how the world changed.
            </p>
          </div>

          <p className="text-[11px] text-[#8d6f76] whitespace-nowrap">
            Same subject · Different world
          </p>
        </div>

        {/* ACTIONS */}

        <div className="mt-6 flex flex-wrap justify-center gap-3">

          <button
            onClick={() =>
              setShowDownloadModal(true)
            }
            className="inline-flex items-center gap-2 rounded-full border border-[#e9d4d9] bg-white px-6 py-3 text-sm font-medium text-[#694650] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Download size={16} />
            Save
          </button>

          <Link
            href={
              original
                ? `/?image=${encodeURIComponent(
                    original
                  )}&fileName=${encodeURIComponent(
                    "Previous image"
                  )}`
                : "/"
            }
            className="inline-flex items-center gap-2 rounded-full border border-[#e9d4d9] bg-white px-6 py-3 text-sm font-medium text-[#694650] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Try another vibe
          </Link>
        </div>
      </div>

      {/* =====================================================
          DOWNLOAD MODAL
      ====================================================== */}

      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3f2830]/35 px-4 backdrop-blur-sm">

          <div className="relative w-full max-w-lg rounded-[28px] border border-[#ecd8dc] bg-[#fffaf7] p-6 shadow-[0_25px_80px_rgba(70,40,50,0.2)] sm:p-8">

            {/* CLOSE */}

            <button
              onClick={() =>
                setShowDownloadModal(false)
              }
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#ead9dd] bg-white text-[#805e67] transition hover:bg-[#fff0f3]"
            >
              <X size={16} />
            </button>

            {/* TITLE */}

            <div className="pr-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#df8da4]">
                Save your world
              </p>

              <h2 className="mt-2 font-serif text-3xl text-[#4d2d36]">
                Choose your export.
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#92757d]">
                Save the original image or your
                transformed VibeShift world.
              </p>
            </div>

            {/* DOWNLOAD TARGET */}

            <div className="mt-6">

              <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-[#8a6871]">
                What do you want to save?
              </p>

              <div className="grid grid-cols-2 gap-3">

                <button
                  onClick={() =>
                    setDownloadTarget("original")
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    downloadTarget === "original"
                      ? "border-[#e596ad] bg-[#fff0f4] shadow-sm"
                      : "border-[#ead9dd] bg-white hover:border-[#e7b8c4]"
                  }`}
                >
                  <p className="text-sm font-medium text-[#63414a]">
                    Original
                  </p>

                  <p className="mt-1 text-xs text-[#a0848a]">
                    Your original image
                  </p>
                </button>

                <button
                  onClick={() =>
                    setDownloadTarget("vibeshift")
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    downloadTarget === "vibeshift"
                      ? "border-[#e596ad] bg-[#fff0f4] shadow-sm"
                      : "border-[#ead9dd] bg-white hover:border-[#e7b8c4]"
                  }`}
                >
                  <p className="text-sm font-medium text-[#63414a]">
                    VibeShift
                  </p>

                  <p className="mt-1 text-xs text-[#a0848a]">
                    Your transformed world
                  </p>
                </button>

              </div>
            </div>

            {/* RATIO OPTIONS */}

            <div className="mt-6">

              <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-[#8a6871]">
                Choose your ratio
              </p>

              <div className="grid gap-3 sm:grid-cols-2">

                {/* 9:16 */}

                <button
                  onClick={() =>
                    setDownloadMode("9:16")
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    downloadMode === "9:16"
                      ? "border-[#e596ad] bg-[#fff0f4] shadow-sm"
                      : "border-[#ead9dd] bg-white hover:border-[#e7b8c4]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">

                    <span className="text-sm font-medium text-[#63414a]">
                      Instagram Story / Reel
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        downloadMode === "9:16"
                          ? "bg-[#e596ad] text-white"
                          : "bg-[#f8eef0] text-[#8a6871]"
                      }`}
                    >
                      9:16
                    </span>

                  </div>

                  <p className="mt-2 text-xs text-[#a0848a]">
                    1080 × 1920
                  </p>
                </button>

                {/* 4:5 */}

                <button
                  onClick={() =>
                    setDownloadMode("4:5")
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    downloadMode === "4:5"
                      ? "border-[#e596ad] bg-[#fff0f4] shadow-sm"
                      : "border-[#ead9dd] bg-white hover:border-[#e7b8c4]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">

                    <span className="text-sm font-medium text-[#63414a]">
                      Instagram Portrait Post
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        downloadMode === "4:5"
                          ? "bg-[#e596ad] text-white"
                          : "bg-[#f8eef0] text-[#8a6871]"
                      }`}
                    >
                      4:5
                    </span>

                  </div>

                  <p className="mt-2 text-xs text-[#a0848a]">
                    1080 × 1350
                  </p>
                </button>

                {/* 1:1 */}

                <button
                  onClick={() =>
                    setDownloadMode("1:1")
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    downloadMode === "1:1"
                      ? "border-[#e596ad] bg-[#fff0f4] shadow-sm"
                      : "border-[#ead9dd] bg-white hover:border-[#e7b8c4]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">

                    <span className="text-sm font-medium text-[#63414a]">
                      Square Post
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        downloadMode === "1:1"
                          ? "bg-[#e596ad] text-white"
                          : "bg-[#f8eef0] text-[#8a6871]"
                      }`}
                    >
                      1:1
                    </span>

                  </div>

                  <p className="mt-2 text-xs text-[#a0848a]">
                    1080 × 1080
                  </p>
                </button>

                {/* 16:9 */}

                <button
                  onClick={() =>
                    setDownloadMode("16:9")
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    downloadMode === "16:9"
                      ? "border-[#e596ad] bg-[#fff0f4] shadow-sm"
                      : "border-[#ead9dd] bg-white hover:border-[#e7b8c4]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">

                    <span className="text-sm font-medium text-[#63414a]">
                      Landscape / YouTube
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        downloadMode === "16:9"
                          ? "bg-[#e596ad] text-white"
                          : "bg-[#f8eef0] text-[#8a6871]"
                      }`}
                    >
                      16:9
                    </span>

                  </div>

                  <p className="mt-2 text-xs text-[#a0848a]">
                    1920 × 1080
                  </p>
                </button>

                {/* 3:4 */}

                <button
                  onClick={() =>
                    setDownloadMode("3:4")
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    downloadMode === "3:4"
                      ? "border-[#e596ad] bg-[#fff0f4] shadow-sm"
                      : "border-[#ead9dd] bg-white hover:border-[#e7b8c4]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">

                    <span className="text-sm font-medium text-[#63414a]">
                      Portrait
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        downloadMode === "3:4"
                          ? "bg-[#e596ad] text-white"
                          : "bg-[#f8eef0] text-[#8a6871]"
                      }`}
                    >
                      3:4
                    </span>

                  </div>

                  <p className="mt-2 text-xs text-[#a0848a]">
                    1080 × 1440
                  </p>
                </button>

                {/* CUSTOM */}

                <button
                  onClick={() =>
                    setDownloadMode("custom")
                  }
                  className={`rounded-2xl border p-4 text-left transition sm:col-span-2 ${
                    downloadMode === "custom"
                      ? "border-[#e596ad] bg-[#fff0f4] shadow-sm"
                      : "border-[#ead9dd] bg-white hover:border-[#e7b8c4]"
                  }`}
                >
                  <div className="flex items-center justify-between">

                    <span className="text-sm font-medium text-[#63414a]">
                      Custom ratio
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        downloadMode === "custom"
                          ? "bg-[#e596ad] text-white"
                          : "bg-[#f8eef0] text-[#8a6871]"
                      }`}
                    >
                      CUSTOM
                    </span>

                  </div>

                  <p className="mt-2 text-xs text-[#a0848a]">
                    Choose your own dimensions.
                  </p>
                </button>

              </div>
            </div>

            {/* CUSTOM DIMENSIONS */}

            {downloadMode === "custom" && (
              <div className="mt-4 grid grid-cols-2 gap-3">

                <div>
                  <label className="mb-2 block text-xs font-medium text-[#765760]">
                    Width
                  </label>

                  <input
                    value={customWidth}
                    onChange={(event) =>
                      setCustomWidth(
                        event.target.value
                      )
                    }
                    type="number"
                    min="1"
                    className="w-full rounded-xl border border-[#ead9dd] bg-white px-4 py-3 text-sm text-[#563740] outline-none focus:border-[#df94aa]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-[#765760]">
                    Height
                  </label>

                  <input
                    value={customHeight}
                    onChange={(event) =>
                      setCustomHeight(
                        event.target.value
                      )
                    }
                    type="number"
                    min="1"
                    className="w-full rounded-xl border border-[#ead9dd] bg-white px-4 py-3 text-sm text-[#563740] outline-none focus:border-[#df94aa]"
                  />
                </div>

              </div>
            )}

            {/* INFO */}

            <div className="mt-5 rounded-2xl bg-[#fff1f4] px-4 py-3">
              <p className="text-xs leading-5 text-[#886a72]">
                Your complete image stays visible.
                VibeShift intelligently extends the
                surrounding world to fit your selected
                format.
              </p>
            </div>

            {/* ACTIONS */}

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() =>
                  setShowDownloadModal(false)
                }
                className="rounded-full border border-[#ead9dd] bg-white px-5 py-3 text-sm font-medium text-[#765760] transition hover:bg-[#fff3f5]"
              >
                Cancel
              </button>

              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-full bg-[#4d3039] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3f252d]"
              >
                <Download size={16} />
                Download image
              </button>

            </div>

          </div>
        </div>
      )}
    </main>
  );
}