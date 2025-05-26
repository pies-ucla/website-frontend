"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import styles from "./ImageSlot.module.css";

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
        // ✅ Bust cache by appending ?t=timestamp
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
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.imageContainer}>
       <img
        src={src}
        alt={slot}
        className={styles.image}
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
          borderRadius: "8px"
        }}
      />
      </div>

      {editable && (
        <>
          <button className={styles.editButton} onClick={handleClick} disabled={loading}>
            {loading ? "Uploading…" : "Replace"}
          </button>
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
  );
};

export default ImageSlot;