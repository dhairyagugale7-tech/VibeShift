"use client";

import { CldUploadWidget } from "next-cloudinary";
import { motion } from "framer-motion";
import BlendVibesModal from "@/components/BlendVibesModal";
import {
  Check,
  Lock,
  Sparkles,
  SlidersHorizontal,
  Link2,
  PenLine,
  UserCircle,
  X,
  CheckCircle2,
  History as HistoryIcon,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
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

type HistoryItem = {
  id: string;
  original: string;
  result: string;
  vibe: string;
  createdAt: number;
};

const HISTORY_KEY = "vibeshift-history";

const customizationOptions: Record<
  string,
  {
    environment: string[];
    decor: string[];
    atmosphere: string[];
    lighting: string[];
  }
> = {
  coquette: {
    environment: [
      "Enchanted rose garden",
      "Elegant Parisian room",
      "Romantic rose palace",
    ],
    decor: [
      "Roses and pearls",
      "Satin ribbons and bows",
      "Flowers and candles",
    ],
    atmosphere: [
      "Dreamy",
      "Romantic",
      "Soft and elegant",
    ],
    lighting: [
      "Warm golden hour",
      "Soft diffused light",
      "Candlelit glow",
    ],
  },

  "dark-luxury": {
    environment: [
      "Midnight palace",
      "Black marble room",
      "Luxury velvet lounge",
    ],
    decor: [
      "Black roses and gold",
      "Candles and crystals",
      "Velvet and antique brass",
    ],
    atmosphere: [
      "Mysterious",
      "Sensual",
      "Dramatic",
    ],
    lighting: [
      "Moonlit",
      "Warm candlelight",
      "Golden spotlight",
    ],
  },

  botanical: {
    environment: [
      "Luxury glass greenhouse",
      "Secret botanical garden",
      "Enchanted conservatory",
    ],
    decor: [
      "Leaves and orchids",
      "Moss and wildflowers",
      "Vines and morning dew",
    ],
    atmosphere: [
      "Fresh",
      "Peaceful",
      "Enchanted",
    ],
    lighting: [
      "Morning sunlight",
      "Filtered sunlight",
      "Soft overcast light",
    ],
  },

  dreamy: {
    environment: [
      "Lavender dream garden",
      "Floating cloud palace",
      "Glowing lakeside",
    ],
    decor: [
      "Floating petals",
      "Stars and glowing orbs",
      "Flowers and mist",
    ],
    atmosphere: [
      "Ethereal",
      "Magical",
      "Soft and surreal",
    ],
    lighting: [
      "Twilight glow",
      "Moonlit",
      "Pearlescent light",
    ],
  },

  y2k: {
    environment: [
      "Chrome dream room",
      "Iridescent palace",
      "Futuristic luxury lounge",
    ],
    decor: [
      "Chrome and bubbles",
      "Holograms and crystals",
      "Glossy glass objects",
    ],
    atmosphere: [
      "Playful",
      "Glamorous",
      "Futuristic",
    ],
    lighting: [
      "Pastel neon",
      "Dreamy studio flash",
      "Iridescent glow",
    ],
  },

  minimal: {
    environment: [
      "Luxury ivory studio",
      "Floating cloud palace",
      "Sculptural cream room",
    ],
    decor: [
      "Stone and linen",
      "Sheer curtains",
      "Pearl accents",
    ],
    atmosphere: [
      "Serene",
      "Editorial",
      "Heavenly",
    ],
    lighting: [
      "Soft sunrise",
      "Diffused daylight",
      "Champagne glow",
    ],
  },
};


const vibeBlendProfiles: Record<
  string,
  {
    palette: string;
    materials: string;
    decor: string;
    atmosphere: string;
    lighting: string;
  }
> = {
  coquette: {
    palette: "blush pink, cream, soft rose, delicate pastel tones",
    materials: "lace, satin, porcelain, glass, delicate fabric",
    decor: "roses, pearls, bows, elegant feminine details",
    atmosphere: "romantic, graceful, soft, feminine",
    lighting: "soft rosy glow, flattering diffused light",
  },

  "dark-luxury": {
    palette: "black, deep burgundy, espresso, champagne gold",
    materials: "velvet, polished marble, dark wood, glossy surfaces",
    decor: "gold accents, elegant objects, refined luxury details",
    atmosphere: "moody, sophisticated, dramatic, expensive",
    lighting: "deep cinematic shadows, warm highlights, dramatic contrast",
  },

  botanical: {
    palette: "sage, forest green, cream, earthy natural tones",
    materials: "stone, wood, linen, natural fibers, glass",
    decor: "lush leaves, botanical foliage, flowers, organic details",
    atmosphere: "fresh, natural, peaceful, organic",
    lighting: "soft natural daylight filtered through foliage",
  },

  dreamy: {
    palette: "lavender, powder blue, soft pink, cream, pastel tones",
    materials: "soft fabric, translucent glass, delicate surfaces",
    decor: "floating petals, subtle sparkles, clouds, ethereal details",
    atmosphere: "ethereal, magical, peaceful, dreamlike",
    lighting: "diffused glow, soft bloom, gentle luminous highlights",
  },

  y2k: {
    palette: "bubblegum pink, silver, lilac, icy blue, vibrant accents",
    materials: "chrome, glossy plastic, glass, reflective surfaces",
    decor: "playful futuristic objects, glossy accents, retro-futuristic details",
    atmosphere: "playful, energetic, nostalgic, futuristic",
    lighting: "bright glossy highlights, colorful ambient glow",
  },

  minimal: {
    palette: "white, ivory, beige, taupe, soft neutral tones",
    materials: "matte stone, glass, clean wood, refined ceramic",
    decor: "minimal sculptural objects, restrained elegant details",
    atmosphere: "calm, clean, sophisticated, uncluttered",
    lighting: "soft architectural light, gentle shadows, controlled highlights",
  },
};

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

export default function VibeShiftHome() {
  const [selectedVibe, setSelectedVibe] = useState("coquette");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [fileName, setFileName] = useState("perfume-bottle.jpg");

  const [showCustomizer, setShowCustomizer] = useState(false);

  const [showBlendModal, setShowBlendModal] = useState(false);

  const [showDescribeModal, setShowDescribeModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [draftCustomPrompt, setDraftCustomPrompt] = useState("");

  const [blendSettings, setBlendSettings] = useState<{
   first: string;
   second: string;
   ratio: number;
  } | null>(null);

  const [customization, setCustomization] = useState({
    environment: 0,
    decor: 0,
    atmosphere: 0,
    lighting: 0,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const previousImage = params.get("image");
    const previousFileName = params.get("fileName");

    if (previousImage) {
      setImageUrl(previousImage);
      setFileName(previousFileName || "Previous image");
    }

    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        if (Array.isArray(parsed)) {
          setHistoryItems(parsed);
        }
      }
    } catch {
      localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  const handleDeleteImage = () => {
    setImageUrl(null);
    setPublicId(null);
    setFileName("perfume-bottle.jpg");

    setSelectedVibe("coquette");
    setBlendSettings(null);
    setCustomPrompt("");
    setDraftCustomPrompt("");

    setCustomization({
      environment: 0,
      decor: 0,
      atmosphere: 0,
      lighting: 0,
    });
  };

  const selected =
    vibes.find((vibe) => vibe.id === selectedVibe) ?? vibes[0];

  const options = customizationOptions[selectedVibe];

  const handleBlendApply = (
    first: string,
    second: string,
    ratio: number
  ) => {
    setBlendSettings({
      first,
      second,
      ratio,
    });

    setSelectedVibe(first);
    setCustomPrompt("");
    setShowBlendModal(false);
  };

  const handleVibeSelect = (vibeId: string) => {
    setSelectedVibe(vibeId);
    setBlendSettings(null);
    setCustomPrompt("");
  };

  const handleDescribeOpen = () => {
    setDraftCustomPrompt(customPrompt);
    setShowDescribeModal(true);
  };

  const handleDescribeApply = () => {
    const trimmedPrompt = draftCustomPrompt.trim();

    if (!trimmedPrompt) {
      alert("Please describe the world you want first.");
      return;
    }

    setCustomPrompt(trimmedPrompt);
    setBlendSettings(null);
    setShowDescribeModal(false);
  };

  const handleHistoryDelete = (id: string) => {
    setHistoryItems((current) => {
      const next = current.filter((item) => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleHistoryClear = () => {
    setHistoryItems([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const openHistoryItem = (item: HistoryItem) => {
    window.location.href =
      `/result?original=${encodeURIComponent(item.original)}` +
      `&result=${encodeURIComponent(item.result)}` +
      `&vibe=${encodeURIComponent(item.vibe)}`;
  };

  const shiftMyVibe = async () => {
    if (!imageUrl) {
      alert("Please upload an image first.");
      return;
    }

    try {
      let prompt = "";

      if (customPrompt.trim()) {
        prompt = `
USER-DESCRIBED VIBE:
${customPrompt.trim()}

INTERPRETATION:
Turn the user description into a beautiful, realistic environment surrounding the existing subject.
Treat the user description as creative direction for the world, background, atmosphere, props and lighting.
Make the result visually rich and coherent without changing the subject itself.

IMPORTANT SUBJECT PRESERVATION:
Keep the original subject completely unchanged.
Preserve its exact identity, shape, proportions, colors, position, materials, texture and important details.
Do not redesign, replace, reshape, recolor, move or regenerate the subject.
Only transform the surrounding environment, background, atmosphere, props and lighting.
If the user description asks to change the subject, ignore that part and preserve the original subject.
`;
      } else if (blendSettings) {
        const firstProfile = vibeBlendProfiles[blendSettings.first];
        const secondProfile = vibeBlendProfiles[blendSettings.second];

        const firstName =
          vibes.find((vibe) => vibe.id === blendSettings.first)?.name ??
          blendSettings.first;

        const secondName =
          vibes.find((vibe) => vibe.id === blendSettings.second)?.name ??
          blendSettings.second;

        const firstOptions = customizationOptions[blendSettings.first];
        const secondOptions = customizationOptions[blendSettings.second];

        prompt = `
Create ONE beautiful, cohesive environment that blends two distinct aesthetics.

PRIMARY AESTHETIC: ${firstName}
Influence: ${blendSettings.ratio}%

Palette: ${firstProfile.palette}
Materials: ${firstProfile.materials}
Decor: ${firstProfile.decor}
Atmosphere: ${firstProfile.atmosphere}
Lighting: ${firstProfile.lighting}

SECONDARY AESTHETIC: ${secondName}
Influence: ${100 - blendSettings.ratio}%

Palette: ${secondProfile.palette}
Materials: ${secondProfile.materials}
Decor: ${secondProfile.decor}
Atmosphere: ${secondProfile.atmosphere}
Lighting: ${secondProfile.lighting}

CUSTOMIZATION FOR PRIMARY AESTHETIC:
Environment: ${firstOptions.environment[customization.environment]}
Decor: ${firstOptions.decor[customization.decor]}
Atmosphere: ${firstOptions.atmosphere[customization.atmosphere]}
Lighting: ${firstOptions.lighting[customization.lighting]}

CUSTOMIZATION FOR SECONDARY AESTHETIC:
Environment: ${secondOptions.environment[customization.environment]}
Decor: ${secondOptions.decor[customization.decor]}
Atmosphere: ${secondOptions.atmosphere[customization.atmosphere]}
Lighting: ${secondOptions.lighting[customization.lighting]}

BLENDING RULES:
The primary aesthetic should dominate the overall mood and visual identity according to its percentage.
The secondary aesthetic must clearly contribute recognizable colors, materials, decorative elements, atmosphere and lighting.
Do not make the secondary aesthetic merely symbolic.
Do not create two separate scenes.
Do not split the image into two halves.
Create one unified, believable environment where both aesthetics naturally coexist.
The final image should look meaningfully different when either selected vibe changes.

SUBJECT PRESERVATION:
Keep the original subject completely unchanged.
Preserve its exact identity, shape, proportions, colors, position, materials, texture and important details.
Only transform the surrounding environment, background, atmosphere and lighting.
`;
      } else {
        const basePrompt = vibePrompts[selectedVibe] ?? "";

        prompt = `
${basePrompt}

Additional creative direction for the environment:

Environment: ${options.environment[customization.environment]}
Decor and props: ${options.decor[customization.decor]}
Atmosphere: ${options.atmosphere[customization.atmosphere]}
Lighting: ${options.lighting[customization.lighting]}

IMPORTANT:
Keep the original subject completely unchanged.
Do not modify its shape, identity, proportions, colors, position, materials, or important details.
Only transform the surrounding environment, background, atmosphere and lighting.
`;
      }

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
        throw new Error(data.error || "Generation failed");
      }

      const resultVibe = customPrompt.trim()
        ? "custom-vibe"
        : blendSettings
        ? `${blendSettings.first} + ${blendSettings.second}`
        : selectedVibe;

      window.location.href =
        `/result?original=${encodeURIComponent(imageUrl)}` +
        `&result=${encodeURIComponent(data.resultUrl)}` +
        `&vibe=${encodeURIComponent(resultVibe)}`;
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
              onClick={() => setShowHistory(true)}
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
              <div
                className="flex w-full items-center gap-4 rounded-[20px] border border-dashed p-4 text-left transition"
                style={{
                  backgroundColor: "#FDEEF2",
                  borderColor: "#EFAFC0",
                }}
              >
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.995 }}
                  onClick={() => open()}
                  className="flex min-w-0 flex-1 items-center gap-4 text-left"
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
                        ? "Uploaded. Tap here to change photo"
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

                {imageUrl && (
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border bg-white px-3 py-2 text-[11px] transition hover:bg-[#FFF8F4]"
                    style={{
                      borderColor: "#F0CCD7",
                      color: "#8A5A6C",
                    }}
                    aria-label="Delete current image"
                  >
                    <X size={13} />
                    Delete
                  </button>
                )}
              </div>
            )}
          </CldUploadWidget>

          {imageUrl && (
            <p
              className="mt-2 px-1 text-[10px]"
              style={{ color: "#B58A99" }}
            >
              Want to use a different picture? Delete this image, then upload a new one.
            </p>
          )}
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
                  onClick={() => handleVibeSelect(vibe.id)}
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
            onClick={() => setShowCustomizer(true)}
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
            onClick={() => setShowBlendModal(true)}
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
            onClick={handleDescribeOpen}
            className="flex items-center gap-2 rounded-full border bg-transparent px-4 py-2 text-[12px] transition hover:bg-white"
            style={{
              borderColor: customPrompt ? "#E8829F" : "#F0CCD7",
              color: customPrompt ? "#E8829F" : "#5A2A3E",
              backgroundColor: customPrompt ? "#FDEEF2" : "transparent",
            }}
          >
            <PenLine size={13} />
            {customPrompt ? "Edit your vibe" : "Describe your vibe"}
          </button>
        </section>

        {/* ================= MAKE IT YOURS ================= */}

        {showCustomizer && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#3D2430]/25 p-3 backdrop-blur-[3px] sm:items-center sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full max-w-[720px] overflow-hidden rounded-[26px] border bg-[#FFF8F4] shadow-2xl"
              style={{ borderColor: "#F0CCD7" }}
            >
              {/* HEADER */}

              <div
                className="flex items-start justify-between border-b px-5 py-5 sm:px-6"
                style={{ borderColor: "#F2D8DF" }}
              >
                <div>
                  <p
                    className="text-[11px] uppercase tracking-[0.16em]"
                    style={{ color: "#E8829F" }}
                  >
                    Customize your world
                  </p>

                  <h2
                    className="mt-1 text-[25px]"
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      color: "#5A2A3E",
                    }}
                  >
                    Make {selected.name} yours.
                  </h2>

                  <p
                    className="mt-1 text-[12px]"
                    style={{ color: "#8A5A6C" }}
                  >
                    Shape the world around your subject.
                  </p>
                </div>

                <button
                  onClick={() => setShowCustomizer(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border transition hover:bg-white"
                  style={{
                    borderColor: "#F0CCD7",
                    color: "#8A5A6C",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* OPTIONS */}

              <div className="max-h-[65vh] overflow-y-auto px-5 py-5 sm:px-6">
                <div className="grid gap-5 sm:grid-cols-2">

                  {/* ENVIRONMENT */}

                  <section>
                    <h3
                      className="mb-2 text-[13px] font-medium"
                      style={{ color: "#5A2A3E" }}
                    >
                      Environment
                    </h3>

                    <div className="space-y-2">
                      {options.environment.map((value, index) => {
                        const active =
                          customization.environment === index;

                        return (
                          <button
                            key={value}
                            onClick={() =>
                              setCustomization((current) => ({
                                ...current,
                                environment: index,
                              }))
                            }
                            className="flex w-full items-center justify-between rounded-[14px] border px-3.5 py-3 text-left text-[12px] transition"
                            style={{
                              borderColor: active
                                ? "#E8829F"
                                : "#F0DCE2",
                              backgroundColor: active
                                ? "#FDEEF2"
                                : "#FFFFFF",
                              color: "#5A2A3E",
                            }}
                          >
                            {value}

                            {active && (
                              <CheckCircle2
                                size={15}
                                style={{ color: "#E8829F" }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* DECOR */}

                  <section>
                    <h3
                      className="mb-2 text-[13px] font-medium"
                      style={{ color: "#5A2A3E" }}
                    >
                      Decor & props
                    </h3>

                    <div className="space-y-2">
                      {options.decor.map((value, index) => {
                        const active =
                          customization.decor === index;

                        return (
                          <button
                            key={value}
                            onClick={() =>
                              setCustomization((current) => ({
                                ...current,
                                decor: index,
                              }))
                            }
                            className="flex w-full items-center justify-between rounded-[14px] border px-3.5 py-3 text-left text-[12px] transition"
                            style={{
                              borderColor: active
                                ? "#E8829F"
                                : "#F0DCE2",
                              backgroundColor: active
                                ? "#FDEEF2"
                                : "#FFFFFF",
                              color: "#5A2A3E",
                            }}
                          >
                            {value}

                            {active && (
                              <CheckCircle2
                                size={15}
                                style={{ color: "#E8829F" }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* ATMOSPHERE */}

                  <section>
                    <h3
                      className="mb-2 text-[13px] font-medium"
                      style={{ color: "#5A2A3E" }}
                    >
                      Atmosphere
                    </h3>

                    <div className="space-y-2">
                      {options.atmosphere.map((value, index) => {
                        const active =
                          customization.atmosphere === index;

                        return (
                          <button
                            key={value}
                            onClick={() =>
                              setCustomization((current) => ({
                                ...current,
                                atmosphere: index,
                              }))
                            }
                            className="flex w-full items-center justify-between rounded-[14px] border px-3.5 py-3 text-left text-[12px] transition"
                            style={{
                              borderColor: active
                                ? "#E8829F"
                                : "#F0DCE2",
                              backgroundColor: active
                                ? "#FDEEF2"
                                : "#FFFFFF",
                              color: "#5A2A3E",
                            }}
                          >
                            {value}

                            {active && (
                              <CheckCircle2
                                size={15}
                                style={{ color: "#E8829F" }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* LIGHTING */}

                  <section>
                    <h3
                      className="mb-2 text-[13px] font-medium"
                      style={{ color: "#5A2A3E" }}
                    >
                      Lighting
                    </h3>

                    <div className="space-y-2">
                      {options.lighting.map((value, index) => {
                        const active =
                          customization.lighting === index;

                        return (
                          <button
                            key={value}
                            onClick={() =>
                              setCustomization((current) => ({
                                ...current,
                                lighting: index,
                              }))
                            }
                            className="flex w-full items-center justify-between rounded-[14px] border px-3.5 py-3 text-left text-[12px] transition"
                            style={{
                              borderColor: active
                                ? "#E8829F"
                                : "#F0DCE2",
                              backgroundColor: active
                                ? "#FDEEF2"
                                : "#FFFFFF",
                              color: "#5A2A3E",
                            }}
                          >
                            {value}

                            {active && (
                              <CheckCircle2
                                size={15}
                                style={{ color: "#E8829F" }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                </div>

                {/* RECIPE PREVIEW */}

                <div
                  className="mt-5 rounded-[17px] border bg-white px-4 py-3"
                  style={{ borderColor: "#F0DCE2" }}
                >
                  <p
                    className="text-[11px] font-medium"
                    style={{ color: "#5A2A3E" }}
                  >
                    Your recipe
                  </p>

                  <p
                    className="mt-1 text-[11px] leading-5"
                    style={{ color: "#8A5A6C" }}
                  >
                    {options.environment[customization.environment]}
                    {" · "}
                    {options.decor[customization.decor]}
                    {" · "}
                    {options.atmosphere[customization.atmosphere]}
                    {" · "}
                    {options.lighting[customization.lighting]}
                  </p>
                </div>
              </div>

              {/* FOOTER */}

              <div
                className="flex items-center justify-between border-t px-5 py-4 sm:px-6"
                style={{ borderColor: "#F2D8DF" }}
              >
                <button
                  onClick={() => setShowCustomizer(false)}
                  className="rounded-full px-4 py-2.5 text-[12px]"
                  style={{ color: "#8A5A6C" }}
                >
                  Cancel
                </button>

                <button
                  onClick={() => setShowCustomizer(false)}
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-medium text-white"
                  style={{ backgroundColor: "#E8829F" }}
                >
                  <CheckCircle2 size={14} />
                  Apply customization
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ================= DESCRIBE YOUR VIBE ================= */}

        {showDescribeModal && (
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
                    Create your own world
                  </p>

                  <h2
                    className="mt-1 text-[25px]"
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      color: "#5A2A3E",
                    }}
                  >
                    Describe your vibe.
                  </h2>

                  <p
                    className="mt-1 text-[12px]"
                    style={{ color: "#8A5A6C" }}
                  >
                    Tell VibeShift what world you imagine, in your own words.
                  </p>
                </div>

                <button
                  onClick={() => setShowDescribeModal(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border transition hover:bg-white"
                  style={{
                    borderColor: "#F0CCD7",
                    color: "#8A5A6C",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="px-5 py-5 sm:px-6">
                <label
                  htmlFor="custom-vibe-prompt"
                  className="text-[12px] font-medium"
                  style={{ color: "#5A2A3E" }}
                >
                  Your description
                </label>

                <textarea
                  id="custom-vibe-prompt"
                  value={draftCustomPrompt}
                  onChange={(e) => setDraftCustomPrompt(e.target.value.slice(0, 1200))}
                  placeholder="Example: Put my subject in a dreamy Parisian rooftop at sunset, with blush clouds, glowing fairy lights, soft roses and elegant vintage details..."
                  rows={7}
                  className="mt-2 w-full resize-none rounded-[18px] border bg-white px-4 py-4 text-[13px] leading-6 outline-none transition focus:ring-2 focus:ring-[#E8829F]/20"
                  style={{
                    borderColor: "#F0CCD7",
                    color: "#5A2A3E",
                  }}
                />

                <div className="mt-2 flex items-center justify-between">
                  <p
                    className="text-[10px] leading-4"
                    style={{ color: "#A47A89" }}
                  >
                    Describe the environment, mood, colors, props, setting or lighting you want.
                  </p>

                  <span
                    className="shrink-0 text-[10px]"
                    style={{ color: "#A47A89" }}
                  >
                    {draftCustomPrompt.length}/1200
                  </span>
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
                    🔒 Your description changes the world around the subject. The original subject stays preserved.
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "dreamy Parisian rooftop at sunset",
                    "dark gothic candlelit room",
                    "futuristic chrome space",
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setDraftCustomPrompt(example)}
                      className="rounded-full border px-3 py-1.5 text-[10px] transition hover:bg-white"
                      style={{
                        borderColor: "#F0CCD7",
                        color: "#8A5A6C",
                      }}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="flex items-center justify-between border-t px-5 py-4 sm:px-6"
                style={{ borderColor: "#F2D8DF" }}
              >
                <button
                  onClick={() => setShowDescribeModal(false)}
                  className="rounded-full px-4 py-2.5 text-[12px]"
                  style={{ color: "#8A5A6C" }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleDescribeApply}
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-medium text-white"
                  style={{ backgroundColor: "#E8829F" }}
                >
                  <Sparkles size={14} />
                  Use this vibe
                </button>
              </div>
            </motion.div>
          </div>
        )}

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
              {customPrompt
                ? "Your custom vibe"
                : blendSettings
                ? `${vibes.find((vibe) => vibe.id === blendSettings.first)?.name ?? "Vibe"} + ${
                    vibes.find((vibe) => vibe.id === blendSettings.second)?.name ?? "Vibe"
                  }`
                : selected.name}
            </h3>

            <p
              className="mt-0.5 text-[12px]"
              style={{ color: "#8A5A6C" }}
            >
              {customPrompt
                ? customPrompt
                : blendSettings
                ? `${blendSettings.ratio}% ${
                    vibes.find((vibe) => vibe.id === blendSettings.first)?.name ?? ""
                  } · ${100 - blendSettings.ratio}% ${
                    vibes.find((vibe) => vibe.id === blendSettings.second)?.name ?? ""
                  }`
                : selected.description}
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
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#3D2430]/25 p-3 backdrop-blur-[3px] sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-[760px] overflow-hidden rounded-[26px] border bg-[#FFF8F4] shadow-2xl"
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
                  Your creations
                </p>
                <h2
                  className="mt-1 text-[25px]"
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    color: "#5A2A3E",
                  }}
                >
                  History.
                </h2>
                <p
                  className="mt-1 text-[12px]"
                  style={{ color: "#8A5A6C" }}
                >
                  Your recent VibeShift creations live here.
                </p>
              </div>

              <button
                onClick={() => setShowHistory(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border transition hover:bg-white"
                style={{
                  borderColor: "#F0CCD7",
                  color: "#8A5A6C",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto px-5 py-5 sm:px-6">
              {historyItems.length === 0 ? (
                <div
                  className="rounded-[18px] border bg-white px-5 py-10 text-center"
                  style={{ borderColor: "#F0DCE2" }}
                >
                  <HistoryIcon
                    size={24}
                    className="mx-auto"
                    style={{ color: "#E8829F" }}
                  />
                  <p
                    className="mt-3 text-[13px] font-medium"
                    style={{ color: "#5A2A3E" }}
                  >
                    No creations yet
                  </p>
                  <p
                    className="mt-1 text-[11px]"
                    style={{ color: "#8A5A6C" }}
                  >
                    Your generated worlds will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {historyItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-[18px] border bg-white p-3"
                      style={{ borderColor: "#F0DCE2" }}
                    >
                      <button
                        onClick={() => openHistoryItem(item)}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                        <img
                          src={item.result}
                          alt={item.vibe}
                          className="h-[72px] w-[72px] shrink-0 rounded-[14px] object-cover"
                        />
                        <div className="min-w-0">
                          <p
                            className="truncate text-[13px] font-medium"
                            style={{ color: "#5A2A3E" }}
                          >
                            {item.vibe === "custom-vibe"
                              ? "Your custom vibe"
                              : item.vibe
                                  .split("+")
                                  .map((part) =>
                                    part
                                      .trim()
                                      .split("-")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ")
                                  )
                                  .join(" + ")}
                          </p>
                          <p
                            className="mt-1 text-[10px]"
                            style={{ color: "#A47A89" }}
                          >
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                          <p
                            className="mt-2 text-[10px]"
                            style={{ color: "#E8829F" }}
                          >
                            Open creation →
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleHistoryDelete(item.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-full border transition hover:bg-[#FDEEF2]"
                        style={{
                          borderColor: "#F0DCE2",
                          color: "#8A5A6C",
                        }}
                        aria-label="Delete history item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {historyItems.length > 0 && (
              <div
                className="flex items-center justify-between border-t px-5 py-4 sm:px-6"
                style={{ borderColor: "#F2D8DF" }}
              >
                <button
                  onClick={handleHistoryClear}
                  className="flex items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] transition hover:bg-white"
                  style={{
                    borderColor: "#F0DCE2",
                    color: "#8A5A6C",
                  }}
                >
                  <Trash2 size={13} />
                  Clear history
                </button>

                <button
                  onClick={() => setShowHistory(false)}
                  className="rounded-full px-4 py-2.5 text-[12px]"
                  style={{ color: "#8A5A6C" }}
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {showBlendModal && (
        <BlendVibesModal
          vibes={vibes}
          initialVibe={selectedVibe}
          onClose={() => setShowBlendModal(false)}
          onApply={handleBlendApply}
        />
      )}
    </main>
  );
}