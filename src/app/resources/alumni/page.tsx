"use client";

import styles from "./alumni.module.css";
import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import AddAlumniModal from "@/components/Alumni/AddAlumniModal/AddAlumniModal";
import AlumniBanner from "@/components/Alumni/AlumniBanner/AlumniBanner";
import AlumniFilter from "@/components/Alumni/AlumniFilter/AlumniFilter";
import EditAlumniModal from "@/components/Alumni/EditAlumniModal/EditAlumniModal";

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
  const [editingAlum, setEditingAlum] = useState<Alumni | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newAlum, setNewAlum] = useState<Alumni>({
    first_name: '',
    last_name: '',
    year: new Date().getFullYear(),
    major: '',
    minor: '',
    occupation: '',
    pie: ''
  });

  const handleEditAlum = async () => {
    if (!editingAlum?.pk) return;
    const payload = { ...editingAlum };
    if (!payload.minor?.trim()) delete payload.minor;
    if (!payload.pie?.trim()) delete payload.pie;

    const res = await fetch(`/api/alumni/${payload.pk}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const updated = await res.json();
      setAlumni((prev) => prev.map(a => a.pk === updated.pk ? updated : a));
      setEditModalOpen(false);
      setEditingAlum(null);
    }
  };
  const handleDeleteAlum = async (id?: number) => {
  if (!id) return;
  if (!confirm("Are you sure you want to delete this alumni?")) return;

  try {
    const res = await fetch(`/api/alumni/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setAlumni((prev) => prev.filter(a => a.pk !== id));
    } else {
      console.error("Failed to delete alumni");
    }
  } catch (err) {
    console.error("Error deleting alumni:", err);
  }
  };


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
  }, [loading, user]);

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
      {editingAlum && (
        <EditAlumniModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          alumni={editingAlum}
          onChange={setEditingAlum}
          onSubmit={handleEditAlum}
        />
      )}
      <AlumniBanner />
      <AlumniFilter
        inputValue={inputValue}
        setInputValue={setInputValue}
        filters={filters}
        applyFilter={applyFilter}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
      />
      {isBoardMember && (
        <div style={{ textAlign: "right",}}>
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

      <div className={styles.alumniGrid}>
        {filteredAlumni.map((alum, index) => (
          <div key={index} className={[styles.alumniCard, styles.alumniText].join(" ")}>
            <h1>
              {alum.first_name} {alum.last_name}
            </h1>
            <h2>UCLA Class of {alum.year}</h2>
            <h2>Major: {formatMajor(alum.major)}</h2>
            <h2>Current occupation: {alum.occupation}</h2>
            {isBoardMember && (
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button
                className={styles.button}
                onClick={() => {
                  setEditingAlum(alum);
                  setEditModalOpen(true);
                }}
              >
                ✎ Edit
              </button>
              <button
                className={styles.button}
                style={{ backgroundColor: "#b83f3b", color: "white" }}
                onClick={() => handleDeleteAlum(alum.pk)}
              >
                🗑️ Delete
              </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}