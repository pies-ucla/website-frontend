'use client';

import { useEffect, useState } from 'react';
import styles from './board.module.css';
import { useAuth } from '@/context/AuthContext';

// Types

type User = {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  major: string;
  minor?: string | null;
  position: string;
};

type BoardMember = {
  id: number;
  user: User;
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
  const { isBoardMember } = useAuth();
  const [board, setBoard] = useState<BoardMember[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<Partial<BoardMember>>({
    user: undefined,
    role: '',
    graduation_year: new Date().getFullYear(),
    description: '',
    pie: '',
  });

  useEffect(() => {
    fetch('/api/board')
      .then(res => res.json())
      .then(setBoard)
      .catch(err => console.error('Failed to fetch board:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/board/${formState.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState),
    });
    const updated = await res.json();
    setBoard(prev => prev.map(m => m.id === updated.id ? updated : m));
    setModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Our Board</h1>

      <div className={styles.columns}>
        {board.map((member, idx) => (
          <div className={styles.textbox} key={member.id}>
            <div className={styles.boardContainer}>
              <div className={styles.boardMask}>
                <img
                  src={member.profile_picture_url || '/default-profile.png'}
                  alt={`${member.user.first_name} ${member.user.last_name}`}
                  className={styles.boardPhoto}
                />
              </div>
              <img src="/pie-tin.png" alt="Frame" className={styles.boardFrameImage} />
            </div>

            <h1 className={styles.role}>{member.role.replaceAll('_', ' ').toUpperCase()}</h1>
            <h1 className={styles.name}>{member.user.first_name} {member.user.last_name}</h1>
            <h2 className={styles.major} onClick={() => setExpandedIdx(prev => prev === idx ? null : idx)}>
              {getYearLevel(member.graduation_year)} <br /> {formatMajor(member.user.major)}
              <span className={styles.arrow}>{expandedIdx === idx ? ' ▲' : ' ▼'}</span>
            </h2>

            {expandedIdx === idx && member.description && (
              <p className={styles.content}>
                <u>Favorite Pie:</u> {member.pie || 'Favorite pie unknown...'} <br /><br />
                <u>Why did you join PIES?</u><br />
                {member.description}
              </p>
            )}

            {isBoardMember && (
              <div className={styles.buttonGroup}>
                <button onClick={() => {
                  setFormState(member);
                  setIsEditing(true);
                  setModalOpen(true);
                }}>Edit</button>
              </div>
            )}
          </div>
        ))}

        {/* Mascot */}
        <div className={styles.textbox}>
          <div className={styles.boardContainer}>
            <div className={styles.boardMask}>
              <img src="/board/pierre.png" alt="Pierre!" className={styles.boardPhoto} />
            </div>
            <img src="/pie-tin.png" alt="Frame" className={styles.boardFrameImage} />
          </div>
          <h1 className={styles.role}>MASCOT</h1>
          <h1 className={styles.name}>Pierre D'Pioneer</h1>
          <h2 className={styles.major}><u>Year:</u> Hmm...a bear never tells his secrets!</h2>
          <p className={styles.content}>
            <u>Favorite Pie:</u> 3.1415926535... <br /><br />
            <u>Why did you join PIES?</u><br />
            Some very nice PIES alumni adopted me from Build-a-Bear, but it has been great to have many amazing PIES members take care of me over the years!
          </p>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <h2>Edit Board Member</h2>
              <input placeholder="Role" value={formState.role || ''} onChange={e => setFormState({ ...formState, role: e.target.value })} />
              <input type="number" placeholder="Graduation Year" value={formState.graduation_year || ''} onChange={e => setFormState({ ...formState, graduation_year: parseInt(e.target.value) })} />
              <textarea placeholder="Why did you join PIES?" value={formState.description || ''} onChange={e => setFormState({ ...formState, description: e.target.value })} />
              <input placeholder="Favorite Pie" value={formState.pie || ''} onChange={e => setFormState({ ...formState, pie: e.target.value })} />
              <div className={styles.modalButtons}>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
