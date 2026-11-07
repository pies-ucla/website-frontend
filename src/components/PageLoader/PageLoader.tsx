"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingText from "../LoadingText/LoadingText";
import styles from "./PageLoader.module.css";

const POLL_MS = 100;
// how long the page has to go with no images still loading before we call it done,
// so images that show up after a fetch (e.g. the board) get caught too
const SETTLE_MS = 300;
// never keep the site hidden longer than this, even if an image hangs
const MAX_WAIT_MS = 10000;
const FADE_MS = 400;

const windowLoaded = () =>
  new Promise<void>((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });

// images on screen that haven't finished loading (offscreen lazy images load later as you scroll)
const pendingImages = () =>
  Array.from(document.images).filter((img) => {
    if (img.complete) return false;
    const rect = img.getBoundingClientRect();
    return rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
  }).length;

// full-screen loading screen that covers the site until the page's fonts and images are loaded
export default function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setVisible(true);
    setFading(false);

    const waitForPage = async () => {
      const start = Date.now();
      await Promise.race([
        Promise.all([windowLoaded(), document.fonts.ready]),
        new Promise((r) => setTimeout(r, MAX_WAIT_MS)),
      ]);

      let quietSince = Date.now();
      while (!cancelled && Date.now() - start < MAX_WAIT_MS) {
        if (pendingImages() > 0) quietSince = Date.now();
        else if (Date.now() - quietSince >= SETTLE_MS) break;
        await new Promise((r) => setTimeout(r, POLL_MS));
      }
      if (cancelled) return;

      setFading(true);
      setTimeout(() => !cancelled && setVisible(false), FADE_MS);
    };

    waitForPage();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // stop the page from scrolling behind the loading screen
  useEffect(() => {
    document.documentElement.style.overflow = visible ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`${styles.overlay} ${fading ? styles.fading : ""}`} aria-busy="true">
      <LoadingText className={styles.text} />
    </div>
  );
}
