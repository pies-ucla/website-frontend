"use client";

import styles from './ask-pierre.module.css';
import { useEffect, useState } from "react";

type Message =
  | { text: string; from: "blue" | "white"; typing?: false }
  | { typing: true };

const messages: Message[] = [
  { text: "Heya! What can I do to get involved?", from: "blue" },
  { typing: true },
  {
    text: "Our club organizes many events including social outings, board game nights, professional development workshops, and technical workshops!",
    from: "white",
  },
  { text: "I'm not Filipino, can I still join?", from: "blue" },
  { typing: true },
  { text: "Yeah, I suppose.", from: "white" },
];

export default function AskPierre() {
  const [visibleBubbles, setVisibleBubbles] = useState<Message[]>([]);
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    setTimeout(() => {
      setMessage(''); // clear after submission
    }, 100);
  };

  useEffect(() => {
    let current = 0;
    let timeout: ReturnType<typeof setTimeout>;

    function showNext() {
      if (current >= messages.length) {
        timeout = setTimeout(() => {
          setVisibleBubbles([]);
          current = 0;
          showNext();
        }, 3000);
        return;
      }

      const nextMessage = messages[current];

      setVisibleBubbles((prev) => {
        const shouldReset = (current - 1) % 3 === 0;
        const updated = shouldReset ? [] : [...prev];

        if (nextMessage.typing) {
          updated.push(nextMessage);
        } else {
          if (updated.length && "typing" in updated[updated.length - 1]) {
            updated[updated.length - 1] = nextMessage;
          } else {
            updated.push(nextMessage);
          }
        }

        return updated;
      });

      const delay = nextMessage.typing ? 1000 : 2000;
      current++;
      timeout = setTimeout(showNext, delay);
    }

    showNext();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Ask Pierre</h1>
      <div className={styles.chat}>
        {visibleBubbles.map((msg, i) =>
          "typing" in msg && msg.typing ? (
            <div key={i} className={`${styles.bubble} ${styles.white}`}>
              <span className={styles.typingDot}></span>
              <span className={styles.typingDot}></span>
              <span className={styles.typingDot}></span>
            </div>
          ) : (
            <div key={i} className={`${styles.bubble} ${styles[msg.from]}`}>
              {msg.text}
            </div>
          )
        )}
      </div>
      <div className={styles.button}>Select a category!</div>
      <form
        action="https://docs.google.com/forms/d/e/1FAIpQLSfUcD6Oi84Wez26ujaUpFX2nMUJe1AsnO0o9_cnED2iSKcxqA/formResponse"
        method="POST"
        target="_blank"
        onSubmit={handleSubmit}
        className={styles.letterWrapper}
      >
        <img
          src="/resources/letter.png"
          alt="Letter to Pierre"
          className={styles.letterImage}
        />
        <textarea
          name="entry.1452242183"
          className={styles.letterTextbox}
          placeholder="Type your message to Pierre here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>
          Send to Pierre!
        </button>
      </form>
    </div>
  );
}