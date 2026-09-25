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

    const cloudinaryUrl = process.env.CLOUDINARY_URL;

    if (!cloudinaryUrl) {
      return NextResponse.json(
        { error: "CLOUDINARY_URL is missing" },
        { status: 500 }
      );
    }

    const parsed = new URL(cloudinaryUrl);

    const apiKey = decodeURIComponent(parsed.username);
    const apiSecret = decodeURIComponent(parsed.password);
    const cloudName = parsed.hostname;

    const auth = Buffer.from(
      `${apiKey}:${apiSecret}`
    ).toString("base64");

    const response = await fetch(
      `https://api.cloudinary.com/v2/generate/${cloudName}/image_to_image`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          prompt: `
Using [1] as the reference image.

Preserve the original subject exactly:
keep its identity, shape, proportions, colors, position and important details.

Change only the world around the subject:
replace the environment, background, decorative elements, atmosphere and lighting.

The subject must remain the same.

${prompt}
          `.trim(),

          reference_images: [
            {
              source_type: "url",
              url: imageUrl,
            },
          ],

          model: {
            mode: "auto",
            preference: "quality",
          },

          image_size: {
            aspect_ratio: "1:1",
            resolution: "1K",
          },

          target: {
            target_type: "managed_asset",
            public_id: `vibeshift/generated/${Date.now()}`,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary generation error:", data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "Cloudinary image generation failed",
        },
        { status: response.status }
      );
    }

    const resultUrl =
      data?.data?.assets?.[0]?.storage?.secure_url;

    if (!resultUrl) {
      console.error("Unexpected Cloudinary response:", data);

      return NextResponse.json(
        { error: "Cloudinary did not return an image URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      resultUrl,
    });
  } catch (error) {
    console.error("Generation error:", error);

    return NextResponse.json(
      { error: "Something went wrong while generating the image" },
      { status: 500 }
    );
  }
}