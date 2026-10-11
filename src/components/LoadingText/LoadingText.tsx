import type { CSSProperties } from "react";
import styles from "./LoadingText.module.css";

// spinning circle followed by text whose letters bounce one after another in a wave
const LoadingText = ({ text = "Loading...", className = "" }: { text?: string; className?: string }) => (
  <span className={`${styles.text} ${className}`} role="status" aria-label={text}>
    <span className={styles.spinner} aria-hidden="true" />
    {text.split("").map((char, i) => (
      <span
        key={i}
        className={styles.letter}
        style={{ "--i": i } as CSSProperties}
        aria-hidden="true"
      >
        {char === " " ? " " : char}
      </span>
    ))}
  </span>
);

export default LoadingText;
