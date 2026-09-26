import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { imageUrl, prompt } = await request.json();

    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: "imageUrl and prompt are required" },
        { status: 400 }
      );
    }

    const marker = "/image/upload/";

    if (!imageUrl.includes(marker)) {
      return NextResponse.json(
        {
          error:
            "The uploaded image is not a valid Cloudinary image URL",
        },
        { status: 400 }
      );
    }

    const [baseUrl, imagePath] = imageUrl.split(marker);

    /*
     * Cloudinary transformation syntax is sensitive to certain
     * characters. Keep the prompt natural-language only and
     * remove characters that can be interpreted as transformation
     * syntax.
     */
    const safePrompt = String(prompt)
      .replace(/[(),;|]/g, " ")
      .replace(/[%#?&=]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    /*
     * Keep the prompt at a reasonable size for a delivery URL.
     * The detailed base vibe prompt is already responsible for
     * the main visual direction.
     */
    const finalPrompt = safePrompt.slice(0, 5000);

    const encodedPrompt = encodeURIComponent(finalPrompt);

    /*
     * Generate a new background while keeping the original
     * foreground/subject intact.
     */
    const resultUrl =
      `${baseUrl}${marker}` +
      `e_gen_background_replace:prompt_${encodedPrompt}/` +
      imagePath;

    console.log("VibeShift Cloudinary transformation created.");

    return NextResponse.json({
      resultUrl,
    });
  } catch (error) {
    console.error("Generation error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while generating the image",
      },
      { status: 500 }
    );
  }
}