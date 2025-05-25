"use client";

import styles from "./alumni.module.css";
import { useEffect, useState } from 'react';
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

type Alumni = {
  first_name: string,
  last_name: string,
  year: number,
  major: string,
  minor: string,
  occupation: string,
  pie: string,
  created_time: Date,
  updated_time: Date,
}

function formatMajor(enumStr: string): string {
  const namePart = enumStr.replace(/^(ba|bs|undeclared)_/, '');
  return namePart
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Alumni() {
  const { user, loading } = useAuth(); 
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filters, setFilters] = useState<string[]>([]);

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
            <Image 
              src="/alumni/uncs.png"
              alt="Alumni DB" 
              width={1920} 
              height={1080}
              style={{
                width: '70%',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '10px',
                border: '4px solid var(--off-yellow)'
              }}
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

      {/* Filter Bar */}
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
      {/* Display cards w/ alumni data */}
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
