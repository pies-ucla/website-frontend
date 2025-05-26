"use client";

import styles from "./alumni.module.css";
import { useEffect, useState } from 'react';
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import ImageSlot from "@/components/ImageSlot/ImageSlot";
import React from 'react';

function Modal({ isOpen, onClose, children }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.modalClose}>×</button>
        {children}
      </div>
    </div>
  );
}

type Alumni = {
  pk?: number,
  first_name: string,
  last_name: string,
  year: number,
  major: string,
  minor?: string,
  occupation: string,
  pie?: string,
  created_time?: Date,
  updated_time?: Date,
}

function formatMajor(enumStr: string): string {
  const namePart = enumStr.replace(/^(ba|bs|undeclared)_/, '');
  return namePart
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Alumni() {
  const { user, loading, isBoardMember } = useAuth(); 
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const [images, setImages] = useState({
    uncs: `/alumni/uncs.webp?t=${Date.now()}`
  });
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
      // Remove empty optional fields
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
      <h1 className={styles.header}>Alumni</h1>

      <div className={styles.subsection}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.leftTop}>
              <h1 className={styles.subHeader}>
                These successful PIES alumni are open to career-related outreach!
              </h1>
            </div>
            <div className={styles.leftBottom}>
              <div className={styles.box}>
                <b className={styles.contactText}>
                  contact <u>reaguz@g.ucla.edu</u> for alumni contact info!
                </b>
              </div>
            </div>
          </div>
          <div className={styles.right} style={{display: 'flex', justifyContent: 'center'}}>
            <ImageSlot
              slot="uncs"
              src={images.uncs}
              editable={isBoardMember}
              targetDir="alumni"
              onImageReplaced={(newUrl) =>
                setImages((prev) => ({
                  ...prev,
                  uncs: `${newUrl}?t=${Date.now()}`
                }))
              }
              className={styles.replaceableImage}
            />
          </div>
        </div>
      </div>

      <div style={{ width: "100%" }}>
        <h1 className={styles.dbHeader}>PIES Alumni Database:</h1>
        <hr className={styles.separator} />
        <div className={styles.grid} style={{ margin: "1.5rem", gap: '5rem' }}>
          <div className={styles.left}>
            <Image 
              src="/alumni/AlumniDBSlide.png"
              alt="Alumni DB" 
              width={1920} 
              height={1080}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
          <div className={[styles.right, styles.box].join(" ")}>
            <p className={styles.contactText}>
              Hi!<br />
              Welcome to the PIES Alumni Database!
            </p>
          </div>
        </div>
      </div>

      {isBoardMember && (
        <div style={{ textAlign: "right", margin: "1rem" }}>
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <h2>Add New Alumni</h2>
            <input placeholder="First name" value={newAlum.first_name} onChange={(e) => setNewAlum({ ...newAlum, first_name: e.target.value })} />
            <input placeholder="Last name" value={newAlum.last_name} onChange={(e) => setNewAlum({ ...newAlum, last_name: e.target.value })} />
            <input placeholder="Year" type="number" value={newAlum.year} onChange={(e) => setNewAlum({ ...newAlum, year: parseInt(e.target.value) })} />
            <input placeholder="Major" value={newAlum.major} onChange={(e) => setNewAlum({ ...newAlum, major: e.target.value })} />
            <input placeholder="Minor" value={newAlum.minor} onChange={(e) => setNewAlum({ ...newAlum, minor: e.target.value })} />
            <input placeholder="Occupation" value={newAlum.occupation} onChange={(e) => setNewAlum({ ...newAlum, occupation: e.target.value })} />
            <input placeholder="Favorite Pie" value={newAlum.pie} onChange={(e) => setNewAlum({ ...newAlum, pie: e.target.value })} />
            <button className={styles.button} onClick={async () => {
                await handleCreateAlum();
                setShowModal(false);
              }}>
              Submit
            </button>
</Modal>

          <button className={styles.button} onClick={() => setShowModal(true)}>
            + Add New Alumni
          </button>
        </div>
      )}

      <div className={styles.filterBar}>
        <h1 style={{color: 'white'}}>filter by major</h1>
        <div>
          <input
            type="text"
            placeholder="search major here"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.searchInput}
          />
          <hr className={styles.separator} style={{ marginTop: '-0.5rem' }} />
        </div>
        <button className={styles.button} onClick={applyFilter}>APPLY FILTERS</button>
        <button className={styles.button} onClick={clearAllFilters}>REMOVE ALL FILTERS</button>
      </div>
      <div className={styles.activeFilters}>
        {filters.map((filter, index) => (
          <span key={index} className={styles.filterChip}>
            {filter}
            <button onClick={() => removeFilter(filter)} className={styles.removeBtn}>×</button>
          </span>
        ))}
      </div>
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