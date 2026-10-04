import { NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const slot = formData.get("slot") as string;
    const targetDir = formData.get("targetDir")?.toString() || "uploads";

    if (!file || !slot) {
      return new Response(JSON.stringify({ error: "Missing image or slot" }), { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // saved as a compressed JPEG: full-size PNG photos were 3-14MB each, which made
    // pages slow and used a lot of server memory when Next.js resized them
    const processedImage = await sharp(buffer)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();

    const relativePath = path.join(targetDir, `${slot}.jpg`);
    const fullPath = path.join(process.cwd(), "public", relativePath);

    // Ensure the directory exists
    const dirPath = path.dirname(fullPath);
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }

    await fs.writeFile(fullPath, processedImage);

    // Public-facing URL
    const imageUrl = `/${relativePath}`;

    return new Response(JSON.stringify({ slot, newImageUrl: imageUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Image replace error:", err);
    return new Response(JSON.stringify({ error: "Image replacement failed" }), { status: 500 });
  }
}