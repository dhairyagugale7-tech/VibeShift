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

    /*
     * The uploaded image is already a Cloudinary delivery URL.
     *
     * Example:
     * https://res.cloudinary.com/cloud/image/upload/v123/vibeshift/originals/photo.jpg
     *
     * We insert Cloudinary's generative background transformation
     * directly into that delivery URL.
     */

    const marker = "/image/upload/";

    if (!imageUrl.includes(marker)) {
      return NextResponse.json(
        { error: "The uploaded image is not a valid Cloudinary image URL" },
        { status: 400 }
      );
    }

    const [baseUrl, imagePath] = imageUrl.split(marker);

    /*
     * Cloudinary expects the natural-language prompt to be URL encoded.
     */
    const safePrompt = prompt
        .replace(/[,;|]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const encodedPrompt = encodeURIComponent(safePrompt);

    /*
     * Generate a new background while keeping the original
     * foreground/subject intact.
     */
    const resultUrl =
      `${baseUrl}${marker}` +
      `e_gen_background_replace:prompt_${encodedPrompt}/` +
      imagePath;

    console.log("VibeShift Cloudinary transformation:");
    console.log(resultUrl);

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