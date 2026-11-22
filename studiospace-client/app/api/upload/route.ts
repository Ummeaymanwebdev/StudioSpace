
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "ImgBB API key is missing" },
        { status: 500 }
      );
    }

    const body = await request.formData();
    const file = body.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Please select an image" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 32 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image must be smaller than 32MB" },
        { status: 400 }
      );
    }

    const base64 = Buffer.from(
      await file.arrayBuffer()
    ).toString("base64");

    const uploadData = new FormData();
    uploadData.append("image", base64);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { message: result.error?.message || "Image upload failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      url: result.data.url,
      displayUrl: result.data.display_url,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      { message: "Could not upload image" },
      { status: 500 }
    );
  }
}
