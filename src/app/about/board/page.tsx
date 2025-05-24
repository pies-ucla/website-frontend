'use client';

import { useEffect, useState } from 'react';
import styles from './board.module.css';

type BoardMember = {
  user: {
    pk: number;
    email: string;
    first_name: string;
    last_name: string;
    major: string;
    minor?: string | null;
    position: string;
  };
  role: string;
  description?: string | null;
  graduation_year: number;
  pie?: string | null;
  linkedin?: string | null;
  resume_url?: string | null;
  profile_picture_url?: string | null;
};

function formatMajor(enumStr: string): string {
  const namePart = enumStr.replace(/^(ba|bs|undeclared)_/, '');
  return namePart
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getYearLevel(graduationYear: number): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const academicYear = currentMonth < 6 ? currentYear - 1 : currentYear;
  const diff = graduationYear - academicYear;

  const yearMap: { [key: number]: string } = {
    0: "Just graduated! :,)",
    1: "4th year",
    2: "3rd year",
    3: "2nd year",
    4: "1st year"
  };

  return yearMap[diff] || `${Math.max(5 - diff, 1)}th+ year`;
}

export default function BoardPage() {
  const [board, setBoard] = useState<BoardMember[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await fetch('/api/board');
        const data = await res.json();
        setBoard(data);
      } catch (err) {
        console.error("Failed to fetch board:", err);
      }
    };

    fetchBoard();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Our Board</h1>
      <div className={styles.columns}>
        {board.map((member, idx) => (
          <div className={styles.textbox} key={idx}>
            <div className={styles.boardContainer}>
              <div className={styles.boardMask}>
                <img
                  src={member.profile_picture_url || '/default-profile.png'}
                  alt={`${member.user.first_name} ${member.user.last_name}`}
                  className={styles.boardPhoto}
                />
              </div>
              <img
                src="/pie-tin.png"
                alt="Frame"
                className={styles.boardFrameImage}
              />
            </div>

            <h1 className={styles.role}>
              {member.role.replaceAll('_', ' ').toUpperCase()}
            </h1>
            <h1 className={styles.name}>
              {member.user.first_name} {member.user.last_name}
            </h1>

            <h2
              className={styles.major}
              onClick={() =>
                setExpandedIdx((prev) => (prev === idx ? null : idx))
              }
            >
              {getYearLevel(member.graduation_year)} {formatMajor(member.user.major)}
              <span className={styles.arrow}>
                {expandedIdx === idx ? ' ▲' : ' ▼'}
              </span>
            </h2>

            {expandedIdx === idx && member.description && (
              <p className={styles.content}>
                <u>Favorite Pie:</u> {member.pie || 'Favorite pie unknown...'} <br /><br />
                <u>Why did you join PIES?</u><br />
                {member.description}
              </p>
            )}
          </div>
        ))}

        {/* Static box for mascot */}
        <div className={styles.textbox}>
          <div className={styles.boardContainer}>
            <div className={styles.boardMask}>
              <img
                src='/board/pierre.png'
                alt='Pierre!'
                className={styles.boardPhoto}
              />
            </div>
            <img
              src="/pie-tin.png"
              alt="Frame"
              className={styles.boardFrameImage}
            />
          </div>

          <h1 className={styles.role}>Mascot</h1>
          <h1 className={styles.name}>Pierre D&apos;Pioneer</h1>

          <h2 className={styles.major}>
            <u>Year:</u> Hmm...a bear never tells his secrets!
          </h2>

          <p className={styles.content}>
            <u>Favorite Pie:</u> 3.1415926535... <br /><br />
            <u>Why did you join PIES?</u><br />
            Some very nice PIES alumni adopted me from Build-a-Bear, but it has been great to have many amazing PIES members take care of me over the years!
          </p>
        </div>
      </div>
    </div>
  );
}
