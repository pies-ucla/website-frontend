'use client';

import { useState } from 'react';
import styles from './board.module.css';

export default function BoardPage() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Our Board</h1>
      <div className={styles.columns}>
        <div className={styles.textbox}>
          <div className={styles.boardContainer}>
            <div className={styles.boardMask}>
              <img
                src="/Irene.avif"
                alt="Irene"
                className={styles.boardPhoto}
              />
            </div>
            <img
              src="/pie-tin.png"
              alt="Frame"
              className={styles.boardFrameImage}
            />
          </div>

          <h1 className={styles.role}>PRESIDENT</h1>
          <h1 className={styles.name}>Irene Cruise</h1>

          <h2
            className={styles.major}
            onClick={() => setExpanded((prev) => !prev)}
          >
            4th year Traditional Civil Engineering
            <span className={styles.arrow}>{expanded ? ' ▲' : ' ▼'}</span>
          </h2>

          {expanded && (
            <p className={styles.content}>
              <u>Favorite Pie:</u> Peach Mango<br /><br />
              <u>Why did you join PIES?</u><br />
              At first I joined PIES because I wanted to make more Filipino friends
              that were in engineering. Although I accomplished that, what made me
              stay was how everyone was so open and welcoming and I made life long
              friends because of that.
            </p>
          )}
        </div>

        <div className={styles.textbox}>
          <p>PIES supports Pilipino engineers through education, mentorship, and outreach.</p>
        </div>
        <div className={styles.textbox}>
          <p>We value community, innovation, and lasting professional development.</p>
        </div>
      </div>
    </div>
  );
}
