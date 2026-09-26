"use client";

import { motion } from "framer-motion";
import { CheckCircle2, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

type Vibe = {
  id: string;
  name: string;
  background: string;
  description: string;
};

type Props = {
  vibes: Vibe[];
  initialVibe: string;
  onClose: () => void;
  onApply: (firstVibe: string, secondVibe: string, ratio: number) => void;
};

export default function BlendVibesModal({
  vibes,
  initialVibe,
  onClose,
  onApply,
}: Props) {
  const [firstVibe, setFirstVibe] = useState(initialVibe);
  const [secondVibe, setSecondVibe] = useState(
    initialVibe === "dark-luxury" ? "coquette" : "dark-luxury"
  );
  const [ratio, setRatio] = useState(65);

  useEffect(() => {
    if (firstVibe === secondVibe) {
      const alternative = vibes.find((vibe) => vibe.id !== firstVibe);

      if (alternative) {
        setSecondVibe(alternative.id);
      }
    }
  }, [firstVibe, secondVibe, vibes]);

  const first = vibes.find((v) => v.id === firstVibe) ?? vibes[0];
  const second = vibes.find((v) => v.id === secondVibe) ?? vibes[1];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#3D2430]/25 p-3 backdrop-blur-[3px] sm:items-center sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-[720px] overflow-hidden rounded-[26px] border bg-[#FFF8F4] shadow-2xl"
        style={{ borderColor: "#F0CCD7" }}
      >
        <div
          className="flex items-start justify-between border-b px-5 py-5 sm:px-6"
          style={{ borderColor: "#F2D8DF" }}
        >
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.16em]"
              style={{ color: "#E8829F" }}
            >
              Blend two worlds
            </p>
            <h2
              className="mt-1 text-[25px]"
              style={{
                fontFamily: "var(--font-fraunces)",
                color: "#5A2A3E",
              }}
            >
              Create your own vibe.
            </h2>
            <p
              className="mt-1 text-[12px]"
              style={{ color: "#8A5A6C" }}
            >
              Mix any two aesthetics into one environment.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border transition hover:bg-white"
            style={{
              borderColor: "#F0CCD7",
              color: "#8A5A6C",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-6 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p
                className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em]"
                style={{ color: "#8A5A6C" }}
              >
                First vibe
              </p>

              <select
                value={firstVibe}
                onChange={(e) => setFirstVibe(e.target.value)}
                className="w-full rounded-[15px] border bg-white px-4 py-3 text-[13px] outline-none"
                style={{
                  borderColor: "#F0CCD7",
                  color: "#5A2A3E",
                }}
              >
                {vibes.map((vibe) => (
                  <option key={vibe.id} value={vibe.id}>
                    {vibe.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p
                className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em]"
                style={{ color: "#8A5A6C" }}
              >
                Second vibe
              </p>

              <select
                value={secondVibe}
                onChange={(e) => setSecondVibe(e.target.value)}
                className="w-full rounded-[15px] border bg-white px-4 py-3 text-[13px] outline-none"
                style={{
                  borderColor: "#F0CCD7",
                  color: "#5A2A3E",
                }}
              >
                {vibes
                  .filter((vibe) => vibe.id !== firstVibe)
                  .map((vibe) => (
                    <option key={vibe.id} value={vibe.id}>
                      {vibe.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between">
              <span
                className="text-[12px] font-medium"
                style={{ color: "#5A2A3E" }}
              >
                {first.name}
              </span>

              <span
                className="text-[11px]"
                style={{ color: "#8A5A6C" }}
              >
                {ratio}% / {100 - ratio}%
              </span>

              <span
                className="text-[12px] font-medium"
                style={{ color: "#5A2A3E" }}
              >
                {second.name}
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="90"
              value={ratio}
              onChange={(e) => setRatio(Number(e.target.value))}
              className="mt-4 w-full accent-[#E8829F]"
            />

            <div className="mt-3 flex justify-between text-[10px]">
              <span style={{ color: "#E8829F" }}>
                {first.name} influence
              </span>
              <span style={{ color: "#8A5A6C" }}>
                {second.name} influence
              </span>
            </div>
          </div>

          <div
            className="mt-7 rounded-[18px] border bg-white p-4"
            style={{ borderColor: "#F0DCE2" }}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: "#E8829F" }} />
              <p
                className="text-[11px] font-medium"
                style={{ color: "#5A2A3E" }}
              >
                Your blend
              </p>
            </div>

            <p
              className="mt-2 text-[12px] leading-5"
              style={{ color: "#8A5A6C" }}
            >
              {first.name} brings <strong>{ratio}%</strong> of the visual
              direction, while {second.name} contributes{" "}
              <strong>{100 - ratio}%</strong>.
            </p>
          </div>

          <div
            className="mt-4 rounded-[15px] border px-4 py-3"
            style={{
              borderColor: "#F0DCE2",
              backgroundColor: "#FDEEF2",
            }}
          >
            <p
              className="text-[11px] leading-5"
              style={{ color: "#5A2A3E" }}
            >
              🔒 Your subject stays unchanged. The blend only transforms the
              surrounding world.
            </p>
          </div>
        </div>

        <div
          className="flex items-center justify-between border-t px-5 py-4 sm:px-6"
          style={{ borderColor: "#F2D8DF" }}
        >
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2.5 text-[12px]"
            style={{ color: "#8A5A6C" }}
          >
            Cancel
          </button>

          <button
            onClick={() => onApply(firstVibe, secondVibe, ratio)}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-medium text-white"
            style={{ backgroundColor: "#E8829F" }}
          >
            <CheckCircle2 size={14} />
            Blend & continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}
