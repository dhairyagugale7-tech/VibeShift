"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ResultPage() {
  const searchParams = useSearchParams();

  const original = searchParams.get("original") || "";
  const result = searchParams.get("result") || "";
  const vibe = searchParams.get("vibe") || "coquette";

  const [imageReady, setImageReady] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [attempt, setAttempt] = useState(0);

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

      // IMPORTANT:
      // Prevent the browser from caching a failed Cloudinary
      // transformation while it is still being generated.
      const cacheBuster =
        result.includes("?") ? "&" : "?";

      img.src =
        `${result}${cacheBuster}v=${Date.now()}`;
    };

    tryLoadImage(1);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [result]);

  return (
    <main className="min-h-screen bg-[#FFF8F4] px-6 py-10 text-[#5A2A3E]">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-4xl">
            Your{" "}
            <span className="italic text-[#E8829F]">
              {vibeName}
            </span>{" "}
            world
          </h1>

          <span className="text-sm">
            🔒 Subject preserved
          </span>
        </div>

        {/* IMAGE COMPARISON */}
        <div className="grid overflow-hidden rounded-[20px] border border-[#F2C9D5] bg-white md:grid-cols-2">

          {/* ORIGINAL */}
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

          {/* RESULT */}
          <div>
            <div className="border-b border-[#F2C9D5] px-4 py-3 text-sm">
              VibeShift
            </div>

            <div className="relative flex aspect-square w-full items-center justify-center bg-white">

              {/* LOADING */}
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

              {/* RESULT */}
              {imageReady && result && (
                <img
                  src={result}
                  alt="VibeShift result"
                  className="h-full w-full object-cover"
                />
              )}

              {/* ERROR */}
              {imageError && (
                <div className="px-6 text-center">

                  <div className="mb-3 text-2xl">
                    ✨
                  </div>

                  <p className="text-sm font-medium text-[#5A2A3E]">
                    We couldn't load your transformed world.
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#8A5A6C]">
                    The image generation may have taken too long.
                    Please try the vibe again.
                  </p>

                  <Link
                    href="/"
                    className="mt-5 inline-flex rounded-full bg-[#E8829F] px-5 py-2.5 text-xs font-medium text-white"
                  >
                    Try again
                  </Link>

                </div>
              )}

            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex gap-3">
          <Link
            href="/"
            className="rounded-full border border-[#E8B7C5] px-5 py-3 text-sm"
          >
            ← Try another vibe
          </Link>
        </div>

      </div>
    </main>
  );
}