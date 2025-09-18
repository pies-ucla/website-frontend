"use client";

import { useEffect, useState } from 'react';
import styles from './board.module.css';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import ImageSlot from '@/components/ImageSlot/ImageSlot';
const API_URL =  process.env.NEXT_PUBLIC_API_URL;

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
  const { isBoardMember, isAdmin } = useAuth();
  const [board, setBoard] = useState<BoardMember[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<Partial<BoardMember>>({
    user: undefined,
    role: '',
    graduation_year: new Date().getFullYear(),
    description: '',
    pie: '',
  });

  useEffect(() => {
    fetch(`${API_URL}/api/board`)
      .then(res => res.json())
      .then(setBoard)
      .catch(err => console.error('Failed to fetch board:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  // Strip out empty fields
    const cleanBody = Object.fromEntries(
      Object.entries(formState).filter(
        ([, value]) => value !== undefined && value !== null && value !== ''
      )
    );

    const res = await fetch(`${API_URL}/api/board/${formState.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanBody),
    });

    const updated = await res.json();
    setBoard(prev => prev.map(m => m.id === updated.id ? updated : m));
    setModalOpen(false);
  };


  // Desired role order
  const roleOrder = [
    "president",
    "internal_vice_president",
    "external_vice_president",
    "alumni_industry_relations",
    "mentorship_coordinator",
    "secretary",
    "treasurer",
    "activities_coordinator",
    "activities_coordinator",
    "public_relations",
    "public_relations",
    "historian",
  ];

  // Sort board members by defined role order
  const sortedBoard = [...board].sort((a, b) => {
    const indexA = roleOrder.findIndex((r, i) => a.role.startsWith(r) && roleOrder.indexOf(r) === i);
    const indexB = roleOrder.findIndex((r, i) => b.role.startsWith(r) && roleOrder.indexOf(r) === i);
    return indexA - indexB;
  });

  // Disambiguate slots for roles with duplicates
  const slotMap = new Map<number, string>();
  const roleCounter = new Map<string, number>();

  sortedBoard.forEach(member => {
    const base = member.role.toLowerCase();
    const count = roleCounter.get(base) || 0;
    roleCounter.set(base, count + 1);
    const slot = count === 0 ? base : `${base}_${count + 1}`;
    slotMap.set(member.id, slot);
  });


  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Our Board</h1>

      <div className={styles.columns}>
        {sortedBoard.map((member, idx) => {
          const slot = slotMap.get(member.id);
          if (!slot) return null;

          return (
            <div className={styles.textbox} key={member.id}>
              <div className={styles.boardContainer}>
                <div className={styles.boardMask}>
                  <ImageSlot
                    slot={slot}
                    src={`/board/${slot}.png`}
                    editable={isBoardMember || isAdmin}
                    targetDir="board"
                    className={styles.replaceableImage}
                    onImageReplaced={() =>
                      setBoard((prev) =>
                        prev.map((m) =>
                          m.id === member.id ? { ...m } : m
                        )
                      )
                    }
                  />
                </div>
                <Image
                  src="/pie-tin.png"
                  alt="Frame"
                  width={200}
                  height={200}
                  className={styles.boardFrameImage}
                />
              </div>

              <h1 className={styles.role}>{member.role.replaceAll('_', ' ').toUpperCase()}</h1>
              <h1 className={styles.name}>{member.user.first_name} {member.user.last_name}</h1>
              <h2 className={styles.major} onClick={() => setExpandedIdx(prev => prev === idx ? null : idx)}>
                {getYearLevel(member.graduation_year)} <br /> {formatMajor(member.user.major)}
                <span className={styles.arrow}>{expandedIdx === idx ? ' ▲' : ' ▼'}</span>
              </h2>

              {expandedIdx === idx && (
                <p className={styles.content}>
                  <u>Favorite Pie:</u> {member.pie || 'Favorite pie unknown...'} <br /><br />
                  <u>Why did you join PIES?</u><br />
                  {member.description || 'No reason provided... yet!'}
                </p>
              )}

              {(isBoardMember || isAdmin) && (
                <div className={styles.buttonGroup}>
                  <button onClick={() => {
                    setFormState(member);
                    setIsEditing(true);
                    setModalOpen(true);
                  }}>Edit</button>
                </div>
              )}
            </div>
          );
        })}
        {/* Mascot */}
        <div className={styles.textbox}>
          <div className={styles.boardContainer}>
            <div className={styles.boardMask}>
              <Image
                src="/board/pierre.png"
                alt="Pierre!"
                width={200}
                height={200}
                className={styles.boardPhoto}
              />
            </div>
            <Image
              src="/pie-tin.png"
              alt="Frame"
              width={200}
              height={200}
              className={styles.boardFrameImage}
            />
          </div>
          <h1 className={styles.role}>MASCOT</h1>
          <h1 className={styles.name}>Pierre D&apos;Pioneer</h1>
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
