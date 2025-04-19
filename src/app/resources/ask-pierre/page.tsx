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
    const [message, setMessage] = useState('');
    const handleSubmit = () => {
      setTimeout(() => {
        setMessage(''); // clear after submission
      }, 100); // small delay to let the form submit first
    };
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
            <form
              action="https://docs.google.com/forms/d/e/1FAIpQLSfUcD6Oi84Wez26ujaUpFX2nMUJe1AsnO0o9_cnED2iSKcxqA/formResponse"
              method="POST"
              target="_blank"
              onSubmit={handleSubmit}
              className={styles.letterWrapper}
            >
                <img src="/resources/letter.png" alt="Letter to Pierre" className={styles.letterImage} />
                <textarea
                  name="entry.1452242183"  // 🔁 Replace with your actual entry ID
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
    )
}