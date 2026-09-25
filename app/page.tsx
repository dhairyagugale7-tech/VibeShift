"use client";

import { CldUploadWidget } from "next-cloudinary";
import { motion } from "framer-motion";
import {
  Check,
  Lock,
  Sparkles,
  SlidersHorizontal,
  Link2,
  PenLine,
  UserCircle,
} from "lucide-react";
import { useState } from "react";
import { vibePrompts } from "@/lib/vibe-prompts";

const vibes = [
  {
    id: "coquette",
    name: "Coquette",
    background: "#F5CEDA",
    description: "Pink flowers, satin, pearls, soft glow",
  },
  {
    id: "dark-luxury",
    name: "Dark luxury",
    background: "#292124",
    description: "Black marble, dark florals, subtle gold",
  },
  {
    id: "botanical",
    name: "Botanical",
    background: "#CEE3C9",
    description: "Greenery, natural textures, sunlight",
  },
  {
    id: "dreamy",
    name: "Dreamy",
    background: "#DCD2F2",
    description: "Lavender, soft glow, floating petals",
  },
  {
    id: "y2k",
    name: "Y2K",
    background: "#CBE5F4",
    description: "Chrome, glossy surfaces, neon accents",
  },
  {
    id: "minimal",
    name: "Minimal",
    background: "#ECE6DD",
    description: "Neutral studio, soft shadows, editorial",
  },
];

function Bottle() {
  return (
    <div className="relative h-[62px] w-[48px]">
      {/* bottle cap */}
      <div className="absolute left-1/2 top-0 h-[9px] w-[10px] -translate-x-1/2 rounded-t-[2px] bg-[#D8B77E]" />

      {/* bottle */}
      <div className="absolute bottom-0 left-1/2 h-[48px] w-[34px] -translate-x-1/2 rounded-[9px] border border-[#E4D9CE] bg-[#FFFDFB]" />
    </div>
  );
}

function VibeDecoration({ id }: { id: string }) {
  if (id === "coquette") {
    return (
      <>
        <div className="absolute left-4 top-4 h-3 w-3 rounded-full bg-white" />
        <div className="absolute right-3 top-2 h-6 w-6 rounded-full bg-[#EF9EBA]" />
      </>
    );
  }

  if (id === "dark-luxury") {
    return (
      <>
        <div className="absolute left-4 top-5 h-[2px] w-10 bg-[#D7B457]" />
        <div className="absolute right-4 top-3 h-5 w-5 rounded-full bg-[#703047]" />
      </>
    );
  }

  if (id === "botanical") {
    return (
      <>
        <div className="absolute left-4 top-4 h-3 w-7 rotate-[-18deg] rounded-full bg-[#82B57C]" />
        <div className="absolute right-4 top-3 h-3 w-7 rotate-[-18deg] rounded-full bg-[#96C58F]" />
      </>
    );
  }

  if (id === "dreamy") {
    return (
      <>
        <div className="absolute left-4 top-4 h-5 w-9 rounded-full bg-white/60" />
        <div className="absolute right-5 top-4 text-lg text-white">
          •
        </div>
        <div className="absolute right-8 top-8 text-xs text-white">
          •
        </div>
      </>
    );
  }

  if (id === "y2k") {
    return (
      <>
        <div className="absolute left-4 top-3 h-7 w-7 rounded-full border-2 border-[#91C8E9]" />
        <div className="absolute right-4 top-5 h-[4px] w-6 rounded-full bg-[#EA79BD]" />
      </>
    );
  }

  return (
    <div className="absolute bottom-3 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-[#D7CFC4]" />
  );
}

export default function Home() {
  const [selectedVibe, setSelectedVibe] = useState("coquette");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [fileName, setFileName] = useState("perfume-bottle.jpg");

  const selected =
    vibes.find((vibe) => vibe.id === selectedVibe) ?? vibes[0];

  const shiftMyVibe = async () => {
    if (!imageUrl) {
      alert("Please upload an image first.");
      return;
    }

    try {
      const prompt = vibePrompts[selectedVibe];

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
          prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Generation failed"
        );
      }

      window.location.href =
        `/result?original=${encodeURIComponent(imageUrl)}` +
        `&result=${encodeURIComponent(data.resultUrl)}` +
        `&vibe=${encodeURIComponent(selectedVibe)}`;
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while generating your vibe."
      );
    }
  };

  return (
    <main
      className="min-h-screen px-2 py-2"
      style={{
        backgroundColor: "#171516",
        fontFamily: "var(--font-dm-sans)",
      }}
    >
      <div
        className="mx-auto min-h-[calc(100vh-16px)] max-w-[1200px] rounded-[24px] px-6 py-5 sm:px-8 lg:px-10"
        style={{
          backgroundColor: "#FFF8F4",
          color: "#5A2A3E",
        }}
      >
        {/* ================= HEADER ================= */}

        <header className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 text-[21px]"
            style={{
              fontFamily: "var(--font-fraunces)",
            }}
          >
            <Sparkles
              size={18}
              strokeWidth={1.8}
              style={{ color: "#E8829F" }}
            />

            <span>VibeShift</span>
          </div>

          <nav className="flex items-center gap-5 text-[13px]">
            <button
              className="font-medium"
              style={{ color: "#5A2A3E" }}
            >
              Create
            </button>

            <button
              className="transition hover:opacity-70"
              style={{ color: "#8A5A6C" }}
            >
              History
            </button>

            <UserCircle
              size={19}
              strokeWidth={1.7}
              style={{ color: "#8A5A6C" }}
            />
          </nav>
        </header>

        {/* ================= HERO ================= */}

        <section className="mx-auto mt-8 max-w-[720px] text-center">
          <h1
            className="text-[38px] leading-[1.03] sm:text-[48px]"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: "#5A2A3E",
            }}
          >
            Same subject.
            <br />

            <span
              className="italic"
              style={{ color: "#E8829F" }}
            >
              Different world.
            </span>
          </h1>

          <p
            className="mt-4 text-[14px] sm:text-[15px]"
            style={{ color: "#8A5A6C" }}
          >
            Upload a photo, pick a vibe, and watch the world around it change.
          </p>
        </section>

        {/* ================= UPLOAD ================= */}

        <section className="mx-auto mt-6 max-w-[1040px]">
          <CldUploadWidget
            uploadPreset="vibeshift_upload"
            onSuccess={(result) => {
              const info = result.info;

              if (
                typeof info === "object" &&
                info !== null &&
                "secure_url" in info
              ) {
                setImageUrl(info.secure_url as string);
                setPublicId(info.public_id as string);

                if ("original_filename" in info) {
                  setFileName(
                    String(info.original_filename) || "uploaded-image"
                  );
                }
              }
            }}
          >
            {({ open }) => (
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.995 }}
                onClick={() => open()}
                className="flex w-full items-center gap-4 rounded-[20px] border border-dashed p-4 text-left transition"
                style={{
                  backgroundColor: "#FDEEF2",
                  borderColor: "#EFAFC0",
                }}
              >
                {/* Preview */}
                <div
                  className="flex h-[66px] w-[66px] shrink-0 items-center justify-center overflow-hidden rounded-[17px] border"
                  style={{
                    backgroundColor: "#FFFDFC",
                    borderColor: "#F0D4DD",
                  }}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Uploaded"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Bottle />
                  )}
                </div>

                {/* File info */}
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-[14px] font-medium"
                    style={{ color: "#5A2A3E" }}
                  >
                    {fileName}
                  </p>

                  <p
                    className="mt-1 text-[12px]"
                    style={{ color: "#8A5A6C" }}
                  >
                    {imageUrl
                      ? "Uploaded. Tap to change photo"
                      : "Upload a photo to get started"}
                  </p>
                </div>

                {/* Check */}
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px]"
                  style={{
                    borderColor: "#E8829F",
                    color: "#E8829F",
                  }}
                >
                  <Check size={14} strokeWidth={2.5} />
                </div>
              </motion.button>
            )}
          </CldUploadWidget>
        </section>

        {/* ================= VIBE TITLE ================= */}

        <section className="mx-auto mt-6 max-w-[1040px]">
          <h2
            className="mb-3 text-[14px] font-medium"
            style={{ color: "#5A2A3E" }}
          >
            What vibe are you feeling?
          </h2>

          {/* ================= VIBE GRID ================= */}

          <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3">
            {vibes.map((vibe) => {
              const active = selectedVibe === vibe.id;

              return (
                <motion.button
                  key={vibe.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setSelectedVibe(vibe.id)}
                  className="group text-left"
                >
                  {/* Visual card */}
                  <div
                    className="relative h-[100px] overflow-hidden rounded-[18px] transition"
                    style={{
                      backgroundColor: vibe.background,
                      border: active
                        ? "2px solid #E8829F"
                        : "2px solid transparent",
                    }}
                  >
                    {/* Selected pink corner effect */}
                    {active && (
                      <motion.div
                        layoutId="selected-vibe"
                        className="absolute inset-0 rounded-[16px]"
                        style={{
                          boxShadow:
                            "inset 0 0 0 1px rgba(255,255,255,0.3)",
                        }}
                      />
                    )}

                    <VibeDecoration id={vibe.id} />

                    {/* The SAME bottle for every vibe */}
                    <div className="absolute inset-0 flex items-end justify-center pb-3">
                      <Bottle />
                    </div>
                  </div>

                  {/* Vibe name */}
                  <p
                    className="mt-1.5 text-center text-[13px] transition"
                    style={{
                      color: active ? "#E8829F" : "#5A2A3E",
                      fontWeight: active ? 500 : 400,
                    }}
                  >
                    {vibe.name}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ================= SMALL ACTION PILLS ================= */}

        <section className="mx-auto mt-4 flex max-w-[1040px] flex-wrap gap-2">
          <button
            className="flex items-center gap-2 rounded-full border bg-transparent px-4 py-2 text-[12px] transition hover:bg-white"
            style={{
              borderColor: "#F0CCD7",
              color: "#5A2A3E",
            }}
          >
            <SlidersHorizontal size={13} />
            Make it yours
          </button>

          <button
            className="flex items-center gap-2 rounded-full border bg-transparent px-4 py-2 text-[12px] transition hover:bg-white"
            style={{
              borderColor: "#F0CCD7",
              color: "#5A2A3E",
            }}
          >
            <Link2 size={13} />
            Blend two vibes
          </button>

          <button
            className="flex items-center gap-2 rounded-full border bg-transparent px-4 py-2 text-[12px] transition hover:bg-white"
            style={{
              borderColor: "#F0CCD7",
              color: "#5A2A3E",
            }}
          >
            <PenLine size={13} />
            Describe your vibe
          </button>
        </section>

        {/* ================= RECIPE CARD ================= */}

        <section
          className="mx-auto mt-5 flex max-w-[1040px] flex-col gap-4 rounded-[19px] border bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "#EFCBD6" }}
        >
          <div>
            <h3
              className="text-[15px] font-medium"
              style={{ color: "#5A2A3E" }}
            >
              {selected.name}
            </h3>

            <p
              className="mt-0.5 text-[12px]"
              style={{ color: "#8A5A6C" }}
            >
              {selected.description}
            </p>

            <div
              className="mt-2 flex items-center gap-2 text-[11px]"
              style={{ color: "#E8829F" }}
            >
              <Lock size={12} />
              Subject, shape, colors and composition stay the same
            </div>
          </div>

          {/* ONE MAIN PINK BUTTON */}
          <button
            className="flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-[13px] font-medium text-white transition hover:brightness-95"
            style={{
              backgroundColor: "#E8829F",
            }}
            onClick={shiftMyVibe}
          >
            <Sparkles size={14} />
            Shift my vibe
          </button>
        </section>
      </div>
    </main>
  );
}