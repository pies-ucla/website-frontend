"use client";

import styles from "./AddAlumniModal.module.css";
import React from "react";

type Alumni = {
  first_name: string;
  last_name: string;
  year: number;
  major: string;
  minor?: string;
  occupation: string;
  pie?: string;
};

export default function AddAlumniModal({
  isOpen,
  onClose,
  newAlum,
  setNewAlum,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  newAlum: Alumni;
  setNewAlum: (a: Alumni) => void;
  onSubmit: () => Promise<void>;
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.modalClose}>×</button>
        <h2 className={styles.title}>Add New Alumni</h2>

        <input placeholder="First name" value={newAlum.first_name} onChange={(e) => setNewAlum({ ...newAlum, first_name: e.target.value })} />
        <input placeholder="Last name" value={newAlum.last_name} onChange={(e) => setNewAlum({ ...newAlum, last_name: e.target.value })} />
        <input placeholder="Year" type="number" value={newAlum.year} onChange={(e) => setNewAlum({ ...newAlum, year: parseInt(e.target.value) })} />
        <input placeholder="Major" value={newAlum.major} onChange={(e) => setNewAlum({ ...newAlum, major: e.target.value })} />
        <input placeholder="Minor" value={newAlum.minor} onChange={(e) => setNewAlum({ ...newAlum, minor: e.target.value })} />
        <input placeholder="Occupation" value={newAlum.occupation} onChange={(e) => setNewAlum({ ...newAlum, occupation: e.target.value })} />
        <input placeholder="Favorite Pie" value={newAlum.pie} onChange={(e) => setNewAlum({ ...newAlum, pie: e.target.value })} />

        <button className={styles.submitButton} onClick={async () => {
          await onSubmit();
          onClose();
        }}>
          Submit
        </button>
      </div>
    </div>
  );
}