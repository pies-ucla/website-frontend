"use client";

import styles from "../AddAlumniModal/AddAlumniModal.module.css";
import React from "react";
import Select from "react-select";
import { Major, MajorLabels, enumToArray } from "@/utils/enums";

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

const majorOptions = enumToArray(Major).map((value) => ({
  value,
  label: MajorLabels[value] || value,
}));

const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "white",
    border: "2px solid var(--off-yellow)",
    padding: "2px",
    borderRadius: "10px",
    fontSize: "1rem",
    fontFamily: "var(--font-normal)",
    color: "var(--primary-red)",
    boxShadow: state.isFocused ? "0 0 0 2px var(--off-yellow)" : "none",
    "&:hover": {
      borderColor: "var(--off-yellow)",
    },
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#999",
    opacity: 0.8,
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "var(--primary-red)",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "white",
    border: "1px solid var(--off-yellow)",
    borderRadius: "10px",
    zIndex: 1000,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#e4b8a5"
      : state.isFocused
      ? "#f7e7b5"
      : "white",
    color: "#b83f3b",
    fontFamily: "var(--font-normal)",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  }),
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
        <h2 className={styles.title}>Edit Alumni</h2>

        <input
          placeholder="First name"
          value={alumni.first_name}
          onChange={(e) => onChange({ ...alumni, first_name: e.target.value })}
        />
        <input
          placeholder="Last name"
          value={alumni.last_name}
          onChange={(e) => onChange({ ...alumni, last_name: e.target.value })}
        />
        <input
          placeholder="Year"
          type="number"
          value={alumni.year}
          onChange={(e) => onChange({ ...alumni, year: parseInt(e.target.value) })}
        />

        <Select
          styles={customSelectStyles}
          options={majorOptions}
          value={majorOptions.find((opt) => opt.value === alumni.major)}
          onChange={(selected) => {
            if (selected) {
              onChange({ ...alumni, major: selected.value });
            }
          }}
          placeholder="Select a major..."
          isSearchable
        />

        <input
          placeholder="Minor"
          value={alumni.minor || ""}
          onChange={(e) => onChange({ ...alumni, minor: e.target.value })}
        />
        <input
          placeholder="Occupation"
          value={alumni.occupation}
          onChange={(e) => onChange({ ...alumni, occupation: e.target.value })}
        />
        <input
          placeholder="Favorite Pie"
          value={alumni.pie || ""}
          onChange={(e) => onChange({ ...alumni, pie: e.target.value })}
        />

        <button className={styles.submitButton} onClick={onSubmit}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
