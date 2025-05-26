"use client";

import styles from "./alumni.module.css";
import { useEffect, useState } from 'react';
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import ImageSlot from "@/components/ImageSlot/ImageSlot";
import AddAlumniModal from "@/components/Alumni/AddAlumniModal";
import AlumniBanner from "@/components/Alumni/AlumniBanner/AlumniBanner";
import AlumniFilter from "@/components/Alumni/AlumniFilter/AlumniFilter";

function formatMajor(enumStr: string): string {
  const namePart = enumStr.replace(/^(ba|bs|undeclared)_/, '');
  return namePart
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

type Alumni = {
  pk?: number;
  first_name: string;
  last_name: string;
  year: number;
  major: string;
  minor?: string;
  occupation: string;
  pie?: string;
  created_time?: Date;
  updated_time?: Date;
};

export default function Alumni() {
  const { user, loading, isBoardMember } = useAuth(); 
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newAlum, setNewAlum] = useState<Alumni>({
    first_name: '',
    last_name: '',
    year: new Date().getFullYear(),
    major: '',
    minor: '',
    occupation: '',
    pie: ''
  });

  useEffect(() => {
    if (!loading && user){
      const fetchAlumni = async () => {
        try {
          const res = await fetch('/api/alumni');
          const data = await res.json();
          setAlumni(data);
        } catch (err) {
          console.error("Failed to fetch alumni:", err);
        }
      };
      fetchAlumni();
    }
  }, []);

  const handleCreateAlum = async () => {
    try {
      const payload = { ...newAlum };
      if (!payload.minor?.trim()) delete payload.minor;
      if (!payload.pie?.trim()) delete payload.pie;

      const res = await fetch('/api/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const created = await res.json();
        setAlumni((prev) => [...prev, created]);
        setNewAlum({
          first_name: '',
          last_name: '',
          year: new Date().getFullYear(),
          major: '',
          minor: '',
          occupation: '',
          pie: ''
        });
      }
    } catch (err) {
      console.error("Failed to create alumni:", err);
    }
  };

  const filteredAlumni = alumni.filter((alum) =>
    filters.every((filter) =>
      alum.major.toLowerCase().includes(filter.toLowerCase())
    )
  );

  const applyFilter = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !filters.includes(trimmed)) {
      setFilters((prev) => [...prev, trimmed]);
      setInputValue('');
    }
  };

  const removeFilter = (filterToRemove: string) => {
    setFilters((prev) => prev.filter((f) => f !== filterToRemove));
  };

  const clearAllFilters = () => {
    setFilters([]);
    setInputValue('');
  };

  return (
    <div className={styles.container}>
      <AlumniBanner />
      {isBoardMember && (
        <div style={{ textAlign: "right", margin: "1rem" }}>
          <AddAlumniModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            newAlum={newAlum}
            setNewAlum={setNewAlum}
            onSubmit={handleCreateAlum}
          />
          <button className={styles.button} onClick={() => setShowModal(true)}>
            + Add New Alumni
          </button>
        </div>
      )}

      <AlumniFilter
        inputValue={inputValue}
        setInputValue={setInputValue}
        filters={filters}
        applyFilter={applyFilter}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
      />

      <div className={styles.alumniGrid}>
        {filteredAlumni.map((alum, index) => (
          <div key={index} className={[styles.alumniCard, styles.alumniText].join(" ")}>
            <h1>
              {alum.first_name} {alum.last_name}
            </h1>
            <h2>UCLA Class of {alum.year}</h2>
            <h2>Major: {formatMajor(alum.major)}</h2>
            <h2>Current occupation: {alum.occupation}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}