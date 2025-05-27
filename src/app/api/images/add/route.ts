import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const slot = formData.get("slot") as string;
    const targetDir = formData.get("targetDir")?.toString() || "uploads";

    if (!file || !slot) {
      return new Response(JSON.stringify({ error: "Missing image or slot" }), { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const processedImage = await sharp(buffer)
      .resize({ width: 1920 })
      .toFormat("png")
      .toBuffer();

    const fileName = `${uuidv4()}.png`;
    const relativePath = path.join(targetDir, fileName);
    const fullPath = path.join(process.cwd(), "public", relativePath);

    // ✅ Ensure directory exists using fs.promises
    const dirPath = path.dirname(fullPath);
    try {
      await fs.access(dirPath); // throws if it doesn't exist
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }

    // Save image
    await fs.writeFile(fullPath, processedImage);

    const imageUrl = `/${relativePath}`;

    // ✅ Optional: Update map if you're using one
    // const mapPath = path.join(process.cwd(), "public/uploads/image-map.json");
    // ...

    return new Response(JSON.stringify({ slot, newImageUrl: imageUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Image adding error:", err);
    return new Response(JSON.stringify({ error: "Image adding failed" }), { status: 500 });
  }
}