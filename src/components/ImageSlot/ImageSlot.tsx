"use client";

import { useRef, useState } from "react";
import styles from "./ImageSlot.module.css";
import Image from "next/image";

interface ImageSlotProps {
  src: string;
  slot: string;
  editable: boolean;
  targetDir?: string;
  onImageReplaced?: (newUrl: string) => void;
  className?: string;
}

const ImageSlot = ({
  src,
  slot,
  editable,
  targetDir,
  onImageReplaced,
  className = "",
}: ImageSlotProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (editable) inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("slot", slot);
    if (targetDir) formData.append("targetDir", targetDir);

    try {
      const res = await fetch("/api/images/replace", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        const newUrl = `${data.newImageUrl}?t=${Date.now()}`;
        onImageReplaced?.(newUrl);
      } else {
        console.error("Image replace failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }

    setLoading(false);
  };

  return (
    <div
      className={`${styles.wrapper} ${editable ? styles.editable : ""} ${className}`}
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        <Image
          src={src}
          alt={slot}
          className={styles.image}
          width={200} // Set appropriate size
          height={200} // Set appropriate size
          unoptimized // Optional: disable Next.js optimization if image is dynamic
        />
        {editable && (
          <>
            <div className={styles.overlay}>
              <span className={styles.replaceText}>{loading ? "Uploading…" : "Replace"}</span>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={handleChange}
              hidden
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ImageSlot;
