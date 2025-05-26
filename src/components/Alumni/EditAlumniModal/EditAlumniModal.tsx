"use client";

import styles from "../AddAlumniModal/AddAlumniModal.module.css";
import React from "react";

type Alumni = {
  pk?: number;
  first_name: string;
  last_name: string;
  year: number;
  major: string;
  minor?: string;
  occupation: string;
  pie?: string;
};

type EditAlumniModalProps = {
  isOpen: boolean;
  onClose: () => void;
  alumni: Alumni;
  onChange: (alum: Alumni) => void;
  onSubmit: () => void;
};

export default function EditAlumniModal({
  isOpen,
  onClose,
  alumni,
  onChange,
  onSubmit,
}: EditAlumniModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.modalClose}>×</button>
        <h2>Edit Alumni</h2>
        <input placeholder="First name" value={alumni.first_name} onChange={(e) => onChange({ ...alumni, first_name: e.target.value })} />
        <input placeholder="Last name" value={alumni.last_name} onChange={(e) => onChange({ ...alumni, last_name: e.target.value })} />
        <input placeholder="Year" type="number" value={alumni.year} onChange={(e) => onChange({ ...alumni, year: parseInt(e.target.value) })} />
        <input placeholder="Major" value={alumni.major} onChange={(e) => onChange({ ...alumni, major: e.target.value })} />
        <input placeholder="Minor" value={alumni.minor || ''} onChange={(e) => onChange({ ...alumni, minor: e.target.value })} />
        <input placeholder="Occupation" value={alumni.occupation} onChange={(e) => onChange({ ...alumni, occupation: e.target.value })} />
        <input placeholder="Favorite Pie" value={alumni.pie || ''} onChange={(e) => onChange({ ...alumni, pie: e.target.value })} />
        <button className={styles.button} onClick={onSubmit}>Save Changes</button>
      </div>
    </div>
  );
}
