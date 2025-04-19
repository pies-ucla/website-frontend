'use client';

import styles from './ask-pierre.module.css';
import { useEffect, useState } from "react";

const messages = [
    { text: "Heya! What can I do to get involved?", from: "blue" },
    { typing: true },
    { text: "Our club organizes many events including social outings, board game nights, professional development workshops, and technical workshops!", from: "white" },
    { text: "I'm not Filipino, can I still join?", from: "blue" },
    { typing: true },
    { text: "Yeah, I suppose.", from: "white" },
];

export default function AskPierre(){
    const [visibleBubbles, setVisibleBubbles] = useState([]);
    useEffect(() => {
        let current = 0;
        let timeout;
      
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
            // If this is a "typing..." bubble, just add it
            if (nextMessage.typing) {
              updated.push(nextMessage);
            } else {
              // Replace the last item if it's a typing bubble
              if (updated.length && updated[updated.length - 1].typing) {
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
                    msg.typing ? (
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
            <div className={styles.letterWrapper}>
              <img src="/resources/letter.png" alt="Letter to Pierre" className={styles.letterImage} />
              <textarea
                className={styles.letterTextbox}
                placeholder="Type your message to Pierre here..."
              />
            </div>
            <div className={styles.button}>Send to Pierre!</div>
        </div>
    )
}