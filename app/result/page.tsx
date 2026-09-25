"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function ResultPage() {
  const searchParams = useSearchParams();

  const original =
    searchParams.get("original") || "";

  const result =
    searchParams.get("result") || "";

  const [imageReady, setImageReady] = useState(false);

  const [imageError, setImageError] = useState(false);

  const vibe =
    searchParams.get("vibe") || "coquette";

  const vibeName =
    vibe
      .split("-")
      .map((word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
    
    // useEffect(() => {
    // if (!result) return;

    // let cancelled = false;

    // const tryLoadImage = () => {
    //     const img = new Image();

    //     img.onload = () => {
    //     if (!cancelled) {
    //         setImageReady(true);
    //         setImageError(false);
    //     }
    //     };

    //     img.onerror = () => {
    //     if (cancelled) return;

    //     setTimeout(() => {
    //         tryLoadImage();
    //     }, 4000);
    //     };

    //     img.src = result;
    // };

    // tryLoadImage();

    // return () => {
    //     cancelled = true;
    // };
    // }, [result]);

  return (
    <main className="min-h-screen bg-[#FFF8F4] px-6 py-10 text-[#5A2A3E]">
      
      <div className="mx-auto max-w-5xl">

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

            {result && !imageReady && (
                <div className="flex aspect-square w-full items-center justify-center">
                    <div className="text-center">
                    <div className="mb-3 text-3xl">✨</div>
                    <p className="text-sm text-[#8A5A6C]">
                        Creating your new world...
                    </p>
                    <p className="mt-1 text-xs text-[#B58A9A]">
                        This can take a few seconds
                    </p>
                    </div>
                </div>
                )}

                {result && imageReady && (
                <img
                    src={result}
                    alt="VibeShift result"
                    className="aspect-square w-full object-cover"
                />
                )}
          </div>

        </div>

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